// ==UserScript==
// @name        SGAddUserTimelines
// @namespace   https://twitter.com/11powder
// @description Stroll Greenのチャットにキャラクター個人のタイムラインを追加する
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=chat(&.*)?)?$/
// @include     /^http:\/\/st\.x0\.to\/?\?mode=profile&eno=\d+$/
// @version     1.0.1
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGAddUserTimelines.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGAddUserTimelines.user.js
// @grant       none
// ==/UserScript==

(async function() {
    'use strict';

    const DB_NAME = "SGTools_AddUserTimelines";
    const DB_TABLE_NAME = "targets";

    function openSingleTableDB(dbName, tableName, tableSettings) {
        return new Promise((res, rej) => {
            const request = indexedDB.open(dbName);
            request.onerror = (e) => {
                rej("failed to open db");
            };
            request.onsuccess = (e) => {
                res(e.target.result);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                db.createObjectStore(tableName, tableSettings);
            }
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
    async function fetchCharaName(eno) {
        const url = `http://st.x0.to/?mode=profile&eno=${eno}`;
        const html = await (await fetch(url)).text();

        return extractNicknameFromProfile($(html, _vDoc));
    }
    async function extractNicknameFromProfile($doc) {
        return $doc.find(".cdatar > .cdatal").find("img:first").attr("cname") || "";
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
        const name = await fetchCharaName(eno);
        const newTarget = { eno, name };
        await dbPut(db, DB_TABLE_NAME, newTarget);
        appendTimelineButton(newTarget);
    }

    async function confirmThenRemoveTimelineButton(db, $rmvButton) {
        const targetId = $rmvButton.prev().html();
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
            const html = ` <a href="./?mode=chat&list=5&chara=${target.eno}" id="roome${target.eno}" class="roomlink"><span class="roomname">ENo.${target.eno} ${target.name}</span><i class="removetlbutton" data-eno="${target.eno}"></i></a>`;
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
        })
    }

    async function updateTargetDataOfCurrentPage(db) {
        const eno = extractEnoFromTitle();
        if (eno === 0) {
            return;
        }
        const targetEnos = await dbGetAllKeys(db, DB_TABLE_NAME);
        if (targetEnos.indexOf(eno) !== 1) {
            const name = await extractNicknameFromProfile($(document));
            await dbPut(db, DB_TABLE_NAME, { eno, name });
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

    const db = await openSingleTableDB(DB_NAME, DB_TABLE_NAME, { keyPath: "eno" });
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
    width: 1em;
    height: 1em;
    position: absolute;
    right: 8px;
    top: -6px;
    line-height: 100%;
    color: #cc5533;
    border: 1px solid #bbb099;
}
.roomname{
    margin-bottom: 4px;
}
</style>`);
    } else if (currentPage == "profile") {
        updateTargetDataOfCurrentPage(db);
    }
})();
