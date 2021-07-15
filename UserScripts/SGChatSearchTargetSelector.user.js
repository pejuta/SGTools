// ==UserScript==
// @name        SGChatSearchTargetSelector
// @namespace   https://twitter.com/11powder
// @description Stroll Greenのチャット検索対象タイムラインを選択可能にする
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=(?:chat|cdel)(?:&.*)?|index.php)?$/
// @version     1.0.1
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGChatSearchTargetSelector.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGChatSearchTargetSelector.user.js
// @grant       none
// ==/UserScript==

(function() {
    'use strict';
    const TLLIST_TO_NAME = ["全て", "TL", "返信", "発言ツリー", "自分", "ユーザー", "周辺", "メッセージ", "リスト"];

    function replaceTLListInputWithSelect() {
        const innerHtml = TLLIST_TO_NAME.map((e, i) => `<option value="${i}">${e}</option>`).join("");
        const $select = $(`<select name="list">${innerHtml}</select>`);
        const $hiddenInput = $(".mainarea > .sheet:first form").children("[name='list']:first");
        $select.val($hiddenInput.val());
        $hiddenInput.after($select);
        $hiddenInput.remove();
    }

    replaceTLListInputWithSelect();
})();
