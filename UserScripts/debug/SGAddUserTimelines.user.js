// ==UserScript==
// @name        SGAddUserTimelines
// @namespace   https://twitter.com/11powder
// @description Stroll Greenのチャットに任意のタイムラインを追加する
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=(?:chat|cdel)(?:&.*)?|index.php)?$/
// @include     /^http:\/\/st\.x0\.to\/?\?mode=profile&eno=\d+$/
// @version     1.0.11.2
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGAddUserTimelines.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGAddUserTimelines.user.js
// @grant       none
// ==/UserScript==
//
// ver 1.0.10 -> チャット削除後にボタンが表示されない不具合の修正
//            -> 検索タイムライン機能の追加

(async function() {
    'use strict';

    const DB_NAME = "SGTools_AddUserTimelines";
    const DB_TABLE_NAME_PLAYER = "targets";
    const DB_TABLE_NAME_WORD = "searches";
    const DB_VERSION = 2;

    class SearchQuery {
        constructor(mode, list, room, filtereno, keyword, rootid) {
            this.mode = mode;
            this.list = list;
            this.room = room;
            this.filtereno = filtereno;
            this.keyword = keyword;
            this.rootid = rootid;
        }

        toString() {
            return `mode=${this.mode}&list=${this.list}&room=${encodeURIComponent(this.room)}&filtereno=${this.filtereno}&keyword=${encodeURIComponent(this.keyword)}&rootid=${this.rootid}`;
        }

        static parse(query) {
            const re = /mode=([^&]*)&list=([^&]*)&room=([^&]*)&filtereno=([^&]*)&keyword=([^&]*)&rootid=([^&]*)/;
            const m = re.exec(query);
            if (!m) {
                return null;
            }
            return new SearchQuery(m[1], m[2], decodeURIComponent(m[3]), m[4], decodeURIComponent(m[5]), m[6]);
        }
    }

    function openDB() {
        return new Promise((res, rej) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = (e) => {
                console.log("dbを開けませんでした。");
                rej("failed to open db");
            };
            request.onsuccess = (e) => {
                console.log("dbを開きました。");
                res(e.target.result);
            };
            request.onblocked = (e) => {
                console.log("openに失敗しました。blockされています。");
                res(e.target.result);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                const tx = e.target.transaction;

                console.log("old", e.oldVersion, "new", e.newVersion);

                if (!e.oldVersion) {
                    db.createObjectStore(DB_TABLE_NAME_PLAYER, { keyPath: "eno" });
                    console.log(DB_TABLE_NAME_PLAYER + "テーブルを作りました。");
                }
                if (e.oldVersion < 2) {
                    // 5列unique indexは効率が極めて悪いので文字列化して投入することにした。
                    const wordTable = db.createObjectStore(DB_TABLE_NAME_WORD, { keyPath: "id", autoIncrement: true });
                    console.log(DB_TABLE_NAME_WORD + "テーブルを作りました。");
                    wordTable.createIndex("query", "query", { unique: true });
                    console.log(DB_TABLE_NAME_WORD + "テーブルにインデックスを作りました。");
                }
            };
        });
    }

    function dbGetAll(db, tableName) {
        return new Promise((res, rej) => {
            const table = db.transaction([tableName]).objectStore(tableName);
            const request = table.getAll();
            request.onerror = (e) => {
                console.log(tableName + "からの読み出しに失敗しました。");
                rej("failed to getAll from table");
            };
            request.onsuccess = (e) => {
                console.log(tableName + "からの読み出しに成功しました。");
                res(e.target.result);
            };
        });
    }

    function dbGetAllKeys(db, tableName) {
        return new Promise((res, rej) => {
            const table = db.transaction([tableName]).objectStore(tableName);
            const request = table.getAllKeys();
            request.onerror = (e) => {
                rej("failed to getAllKeys from table");
            };
            request.onsuccess = (e) => {
                res(e.target.result);
            };
        });
    }

    function dbPut(db, tableName, item) {
        return new Promise((res, rej) => {
            const table = db.transaction([tableName], "readwrite").objectStore(tableName);
            const request = table.put(item);
            request.onerror = (e) => {
                rej("failed to put an item on table");
            };
            request.onsuccess = (e) => {
                res(e.target.result);
            };
        });
    }

    function dbDelete(db, tableName, key) {
        return new Promise((res, rej) => {
            const table = db.transaction([tableName], "readwrite").objectStore(tableName);
            const request = table.delete(key);
            request.onerror = (e) => {
                rej("failed to delete an item on table");
            };
            request.onsuccess = (e) => {
                res(e.target.result);
            };
        });
    }

    const _vDoc = document.implementation.createHTMLDocument();
    async function fetchCharaInfo(eno) {
        const url = `http://st.x0.to/?mode=profile&eno=${eno}`;
        const req = await fetch(url);
        if (!req.ok) {
            return null;
        }
        const html = await req.text();

        return extractInfoFromProfile($(html, _vDoc));
    }
    // 優先度はNickname > Fullname
    async function extractInfoFromProfile($doc) {
        const $firstIcon = $doc.find(".cdatar > .cdatal").find("img:first");

        const icon = $firstIcon.attr("src");

        let nickname = "";
        if ($firstIcon.length === 1) {
            nickname = $firstIcon.attr("cname") || "";
        }

        if (nickname) {
            return { icon, name: nickname };
        }

        const $profile = $doc.find(".profile > .inner_boardclip");
        if ($profile.length === 1) {
            const id = $profile.html().trim();
            const fullname = id.substr(id.indexOf("　") + 1);
            return { icon, name: fullname };
        }

        return null;
    }

    function extractEnoFromTitle() {
        const m = /^ENo\.(\d+)/i.exec(document.title);
        if (!m) {
            return 0;
        }
        return parseInt(m[1], 10);
    }

    async function inputThenAddNewUserTimelineButton(db) {
        const userTxt = prompt("対象キャラクターのENo.を入力してください。タイムラインを新規追加します。");
        const m = /\d+/.exec(userTxt);
        if (!m) {
            return;
        }
        const eno = parseInt(m[0], 10);
        const info = await fetchCharaInfo(eno);
        if (!info) {
            alert("通信に失敗したか、キャラが存在しないようです。");
            return;
        }
        const newTarget = { eno, name: info.name, icon: info.icon };
        await dbPut(db, DB_TABLE_NAME_PLAYER, newTarget);
        appendUserTimelineButton(newTarget);
    }

    async function confirmThenRemoveUserTimeline(db, $rmvButton) {
        const $targetElem = $rmvButton.prev();
        const targetId = $targetElem.children("img").attr("title") || $targetElem.html();
        const res = confirm(`ユーザータイムライン[ ${targetId} ]を削除します。`);
        if (!res) {
            return;
        }
        const eno = $rmvButton.data("eno");
        removeUserTimelineButton(eno);
        await dbDelete(db, DB_TABLE_NAME_PLAYER, eno);
    }

    function appendUserTimelineButton(target) {
        let arr;
        if (Array.isArray(target)) {
            arr = target;
        } else {
            arr = [target];
        }

        const descendingTargets = arr.slice();
        descendingTargets.sort((a, b) => b.eno - a.eno);

        const $lastRoom = $("a > .roomname").last().parent();

        // eno降順に末尾に追加するので結果的に昇順になる
        descendingTargets.forEach((target) => {
            let html;
            if (target.icon) {
                html = ` <a href="./?mode=chat&list=5&chara=${target.eno}" id="roome${target.eno}" class="roomlink usertl iconlabel"><span class="roomname"><img src="${target.icon}" title="${target.name}(${target.eno})"></span><i class="removetlbutton" data-eno="${target.eno}"></i></a>`;
            } else {
                html = ` <a href="./?mode=chat&list=5&chara=${target.eno}" id="roome${target.eno}" class="roomlink usertl"><span class="roomname">${target.name}(${target.eno})</span><i class="removetlbutton" data-eno="${target.eno}"></i></a>`;
            }
            // TODO: appendTo
            $lastRoom.after(html);
        });
    }
    function removeUserTimelineButton(eno) {
        $(`#roome${eno}`).remove();
    }

    async function addNewSearchTimelineButton(db) {
        const $form = $(".mainarea > .sheet:first form");
        const mode = $form.children("[name='mode']:first").val() || "";
        const list = $form.children("[name='list']:first").val() || "";
        const room = $form.children("[name='room']:first").val() || "";
        const filtereno = $form.children("[name='filtereno']:first").val() || "";
        const keyword = $form.children("[name='keyword']:first").val() || "";

        let rootid = "";
        const $logSavingModeButton = $(".roomnameplace");
        if (list === "3" && $logSavingModeButton.length === 1) {
            const m = /&rootid=(\d+)/.exec($logSavingModeButton.parent("a").attr("href"));
            rootid = m ? m[1] : "";
        }
        const query = new SearchQuery(mode, list, room, filtereno, keyword, rootid);

        let id = 0;
        try {
            id = await dbPut(db, DB_TABLE_NAME_WORD, { query: query.toString() });
        } catch (e) {
            // 重複。
            return;
        }
        appendSearchTimelineButton({ id, query });
    }

    async function confirmThenRemoveSearchTimeline(db, $rmvButton) {
        const $targetElem = $rmvButton.prev();
        const targetText = $targetElem.text();
        const res = confirm(`検索タイムライン[ ${targetText} ]を削除します。`);
        if (!res) {
            return;
        }
        const id = $rmvButton.data("id");
        removeSearchTimelineButton(id);
        await dbDelete(db, DB_TABLE_NAME_WORD, id);
    }

    function appendSearchTimelineButton(target) {
        let arr;
        if (Array.isArray(target)) {
            arr = target;
        } else {
            arr = [target];
        }

        const descendingTargets = arr.slice();
        descendingTargets.sort((a, b) => b.id - a.id);

        const $lastRoom = $("a > .roomname").last().parent();

        // eno降順に末尾に追加するので結果的に昇順になる
        descendingTargets.forEach((t) => {
            let query;
            if (typeof t.query === "string") {
                query = SearchQuery.parse(t.query);
            } else {
                query = t.query
            }

            let listText;
            switch(query.list) {
                case "0": // all
                    listText = "全て";
                    break;
                case "1": // tl
                    listText = "タイムライン";
                    break;
                case "2": // res
                    listText = "返信";
                    break;
                case "3": // tree
                    listText = "発言ツリー" + query.rootid;
                    break;
                case "4": // self
                    listText = "自分";
                    break;
                case "5": // user
                    listText = "ユーザー";
                    break;
                case "6": // room
                    listText = "周辺：" + query.room;
                    break;
                case "7": // message
                    listText = "メッセージ";
                    break;
                case "8": // list
                    listText = "リスト";
                    break;
            }

            const labelHtmls = `<div class="wsroom">at:${listText}</div> <div class="wsquery">${query.filtereno ? `from:${query.filtereno} ` : ""}${query.keyword}</div>`;
            const html = ` <a href="./?${query.toString()}" id="roomws${t.id}" class="roomlink wstl"><i class="searchicon"></i><span class="roomname">${labelHtmls}</span><i class="removetlbutton" data-id="${t.id}"></i></a>`;
            // TODO: appendTo
            $lastRoom.after(html);
        });
    }
    function removeSearchTimelineButton(id) {
        $(`#roomws${id}`).remove();
    }

    function $appendAddNewUserTimelineButton() {
        const $lastRoom = $("a > .roomname").last().parent();
        const html = ` <a href="#" onclick="return false;"><span class="addnewusertl">＋TL</span></a>`;
        $lastRoom.after(html);
        return $(".addnewusertl");
    }

    function $insertAddNewSearchButton() {
        const $submit = $(".mainarea > .sheet:first form input[type='submit']").first();
        const html = `<a href="#" onclick="return false;"><span class="addnewsearchtl">＋TL</span></a>`;
        $submit.after(html);
        return $(".addnewsearchtl");
    }

    async function initButtons(db) {
        console.log("追加するユーザータイムラインの対象データをDBから読みます。");
        const users = await dbGetAll(db, DB_TABLE_NAME_PLAYER);
        console.log("読み出しに完了しました。タイムライン複数を追加します。");
        appendUserTimelineButton(users);
        console.log("追加完了しました。次にユーザー＋ボタンを追加します。");
        const $addUserButton = $appendAddNewUserTimelineButton();
        $addUserButton.on("click", async (e) => await inputThenAddNewUserTimelineButton(db));
        $(document).on("click", ".usertl > .removetlbutton", async function (e) {
            e.preventDefault();
            await confirmThenRemoveUserTimeline(db, $(this));
        });
        console.log("ユーザー＋ボタンの追加完了しました。");
        console.log("検索タイムライン処理を行います。");

        const wordSearches = await dbGetAll(db, DB_TABLE_NAME_WORD);
        appendSearchTimelineButton(wordSearches);
        const $addSearchButton = $insertAddNewSearchButton();
        $addSearchButton.on("click", async (e) => await addNewSearchTimelineButton(db));
        $(document).on("click", ".wstl > .removetlbutton", async function (e) {
            e.preventDefault();
            await confirmThenRemoveSearchTimeline(db, $(this));
        });

        console.log("検索タイムライン処理を完了しました。");
    }

    async function updateTargetDataOfCurrentPage(db) {
        const eno = extractEnoFromTitle();
        if (eno === 0) {
            return;
        }
        const targetEnos = await dbGetAllKeys(db, DB_TABLE_NAME_PLAYER);
        if (targetEnos.indexOf(eno) !== -1) {
            const info = await extractInfoFromProfile($(document));
            await dbPut(db, DB_TABLE_NAME_PLAYER, { eno, name: info.name, icon: info.icon });
        }
    }

    let currentPage = "";
    if ($("#btnreplylist").length === 1) {
        // chat
        console.log("開かれたのはチャットページです。");
        currentPage = "chat";
    } else if ($(".fav").length === 1) {
        // profile
        console.log("開かれたのはプロフィールページです。");
        currentPage = "profile";
    } else {
        return;
    }

    console.log("データベースを開きます。");
    const database = await openDB();
    console.log("データベースを開きました。");
    if (currentPage === "chat") {
        console.log("チャットページの処理を開始します。");
        await initButtons(database);
        console.log("チャットページの処理を完了しました。");
        $(document.head).append(`<style type="text/css">
.roomlink {
    position: relative;
    display: inline-block;
    vertical-align: top;
}
.addnewusertl {
    display: inline-block;
    cursor: pointer;
    padding: 2px 6px;
    box-shadow: 2px 0px 3px #00000066;
    background-color: #ffe1d0;
    color: #333333;
}
.addnewsearchtl {
    display: inline-block;
    cursor: pointer;
    padding: 2px 6px;
    box-shadow: 2px 0px 3px #00000066;
    background-color: #d2f9fb;
    color: #333333;
    margin-left: 6px;
}
.removetlbutton:after {
    content: "✕";
    display: inline-block;
    width: 0.8em;
    height: 0.8em;
    position: absolute;
    right: 8px;
    line-height: 100%;
    color: #cc5533;
    border: 1px solid #bbb099;
    background-color: rgba(255,255,255,0.8);
}
.usertl > .roomname {
    background-color: #ffe1d0;
    border-left: 12px solid #ffac7c;
}
.wstl > .roomname {
    background-color: #d2f9fb;
    border-left: 12px solid #8ae4e8;
    min-width: auto;
    padding: 0px 1.1em 0 8px;
}
.wsroom {

}
.wsquery {
    min-height: 1.5em;
}
.roomname{
    margin-bottom: 4px;
}
.iconlabel .roomname{
    padding: 0;
    padding-left: 0;
    padding-right: 1px;
    min-width: auto;
}
.iconlabel img {
    width: calc(1.5em + 16px);
    height: calc(1.5em + 16px);
}
.searchicon:before {
    content: "\\01F50E";
    display: inline-block;
    font-family: "Segoe UI Symbol";
    position: absolute;
    color: black;
}
</style>`);
    } else if (currentPage === "profile") {
        updateTargetDataOfCurrentPage(database);
    }
})();
