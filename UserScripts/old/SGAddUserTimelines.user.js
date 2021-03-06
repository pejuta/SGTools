// ==UserScript==
// @name        SGAddUserTimelines
// @namespace   https://twitter.com/11powder
// @description Stroll Greenのチャットにキャラクター個人のタイムラインを追加する
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=(?:chat|cdel)(?:&.*)?|index.php)?$/
// @include     /^http:\/\/st\.x0\.to\/?\?mode=profile&eno=\d+$/
// @version     1.0.9.1
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/old/SGAddUserTimelines.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/old/SGAddUserTimelines.user.js
// @grant       none
// ==/UserScript==
//
// ver 1.0.8 -> フォーム送信後にボタンが表示されない不具合の修正

(async function() {
    'use strict';

    const DB_NAME = "SGTools_AddUserTimelines";
    const DB_TABLE_NAME = "targets";
    const DB_VERSION = 1;

    function openSingleTableDB(dbName, tableName, tableSettings, version) {
        return new Promise((res, rej) => {
            const request = indexedDB.open(dbName, version);
            request.onerror = (e) => {
                rej("failed to open db");
            };
            request.onsuccess = (e) => {
                res(e.target.result);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                const tx = e.target.transaction;

                //TODO: fix this if you change version
                let table = db.createObjectStore(tableName, tableSettings);
            };
        });
    }

    function dbGetAll(db, tableName) {
        return new Promise((res, rej) => {
            const table = db.transaction([tableName]).objectStore(tableName);
            const request = table.getAll();
            request.onerror = (e) => {
                rej("failed to getAll from table");
            };
            request.onsuccess = (e) => {
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

    async function inputThenAddNewTimelineButton() {
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
        await dbPut(db, DB_TABLE_NAME, newTarget);
        appendTimelineButton(newTarget);
    }

    async function confirmThenRemoveTimelineButton(db, $rmvButton) {
        const $targetElem = $rmvButton.prev();
        const targetId = $targetElem.children("img").attr("title") || $targetElem.html();
        const res = confirm(`タイムライン表示ボタン[ ${targetId} ]を削除します。`);
        if (!res) {
            return;
        }
        const eno = $rmvButton.data("eno");
        removeTimelineButton(eno);
        await dbDelete(db, DB_TABLE_NAME, eno);
    }

    function appendTimelineButton(target) {
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
                html = ` <a href="./?mode=chat&list=5&chara=${target.eno}" id="roome${target.eno}" class="roomlink iconlabel"><span class="roomname"><img src="${target.icon}" title="${target.name}(${target.eno})"></span><i class="removetlbutton" data-eno="${target.eno}"></i></a>`;
            } else {
                html = ` <a href="./?mode=chat&list=5&chara=${target.eno}" id="roome${target.eno}" class="roomlink"><span class="roomname">${target.name}(${target.eno})</span><i class="removetlbutton" data-eno="${target.eno}"></i></a>`;
            }
            // TODO: appendTo
            $lastRoom.after(html);
        });
    }
    function removeTimelineButton(eno) {
        $(`#roome${eno}`).remove();
    }

    function $appendAddNewTimelineButton() {
        const $lastRoom = $("a > .roomname").last().parent();
        const html = ` <a href="#" onclick="return false;"><span class="addnewtimeline">＋</span></a>`;
        $lastRoom.after(html);
        return $(".addnewtimeline");
    }

    async function initButtons(db) {
        const targets = await dbGetAll(db, DB_TABLE_NAME);
        appendTimelineButton(targets);
        const $addNewButton = $appendAddNewTimelineButton();
        $addNewButton.on("click", inputThenAddNewTimelineButton);
        $(document).on("click", ".removetlbutton", async function (e) {
            e.preventDefault();
            await confirmThenRemoveTimelineButton(db, $(this));
        });
    }

    async function updateTargetDataOfCurrentPage(db) {
        const eno = extractEnoFromTitle();
        if (eno === 0) {
            return;
        }
        const targetEnos = await dbGetAllKeys(db, DB_TABLE_NAME);
        if (targetEnos.indexOf(eno) !== -1) {
            const info = await extractInfoFromProfile($(document));
            await dbPut(db, DB_TABLE_NAME, { eno, name: info.name, icon: info.icon });
        }
    }

    let currentPage = "";
    if ($("#btnreplylist").length === 1) {
        // chat
        currentPage = "chat";
    } else if ($(".fav").length === 1) {
        // profile
        currentPage = "profile";
    } else {
        return;
    }

    const db = await openSingleTableDB(DB_NAME, DB_TABLE_NAME, { keyPath: "eno" }, DB_VERSION);
    if (currentPage == "chat") {
        await initButtons(db);
        $(document.head).append(`<style type="text/css">
.roomlink {
    position: relative;
}
.addnewtimeline {
    display: inline-block;
    cursor: pointer;
    padding: 2px 6px;
    box-shadow: 2px 0px 3px #00000066;
    background-color: #cceeff;
    color: #333333;
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
.roomname{
    margin-bottom: 4px;
}
.iconlabel .roomname{
    padding: 0;
    padding-left: 0;
    padding-right: 1px;
    vertical-align: top;
    min-width: auto;
}
.iconlabel img{
    width: calc(1.5em + 16px);
    height: calc(1.5em + 16px);
}
</style>`);
    } else if (currentPage == "profile") {
        updateTargetDataOfCurrentPage(db);
    }
})();
