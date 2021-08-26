// ==UserScript==
// @name        SGConfirmIfNoResTargetIsSpecified
// @namespace   https://twitter.com/11powder
// @description チャットレスの返信先忘れを予防してくれるかもしれない
// @include     http://st.x0.to/?mode=chat&list=3&*
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGConfirmIfNoResTargetIsSpecified.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGConfirmIfNoResTargetIsSpecified.user.js
// @grant       none
// ==/UserScript==

(() => {
    "use strict";
    function confirmIfNoResTargetSpecified() {
        if ($("#replyarea").children().length) {
            return true;
        }
        if(confirm("返信先が指定されていませんが、本当に発言しますか？")) {
            return true;
        }
        return false;
    }


    if (!$(".roomnameplace").length) {
        return;
    }

    const $text = $("#text");
    $text.closest("form").find("input[type='submit']").on("click", (e) => {
        if (!confirmIfNoResTargetSpecified()) {
            e.preventDefault();
        };
    });

    $text.closest("form").find("input[type='text']").on("keydown", (e) => {
        if(e.keyCode !== 13) {
            return;
        }

        if (!confirmIfNoResTargetSpecified()) {
            e.preventDefault();
        }
    });
})();
