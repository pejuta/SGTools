// ==UserScript==
// @name        SGFlowerDicLBMarker
// @namespace   https://twitter.com/11powder
// @description 花図鑑で上限突破した花を簡単に確認できるようにする。
// @match       http://st.x0.to/?mode=zukan2*
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGFlowerDicLBMarker.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGFlowerDicLBMarker.user.js
// @grant       none
// ==/UserScript==

(() => {
    "use strict";
    $(document.head).append(`<style type="text/css">
        .charaframe2.flowerlb {
            position: relative;
            border-width: 3px;
            border-color: #ffbb44;
            margin: 6px;
        }

        .charaframe2.flowerlb:before {
            content: "＋";
            display: block;
            position: absolute;
            right: 0;
            top: -2px;
            font-size: 20px;
            color: #ffbb44;
            font-weight: bold;
        }

        #showlbbtn {
            display: inline-block;
            padding: 3px;
            padding-left: 12px;
            padding-right: 12px;
            border: 1px #997722 solid;
            border-radius: 3px;
            background-color: #ffdd66;
            color: #774400;
            font-weight: bold;
            cursor: pointer;
        }
    </style>`);

    function getEnoFromLocation() {
        const m = /eno=(\d+)/.exec(location.search);
        if (!m) {
            return "";
        }
        return m[1];
    }

    const _vdoc = document.implementation.createHTMLDocument();
    async function applyLBStyleOnFlowers() {
        const eno = getEnoFromLocation();

        let targetUrl = "http://st.x0.to/?mode=zukan";
        if (eno) {
            targetUrl += "&zeno=" + eno;
        }

        const res = await fetch(targetUrl);
        if (!res.ok) {
            alert(res.statusText + " " + res.status);
            return;
        }
        const html = await res.text();

        const lbSet = new Set();
        $(html, _vdoc).find(".profile + .framearea > .talkarea").each((i, e) => {
            const num = parseInt($(e).children("b:first").html().split("　")[0].slice(4), 10);
            const isLB = $(e).children("small:last").children("b").filter((i, b) => {
                return $(b).attr("style") === "color: #30aa10;";
            }).length > 0;
            if (isLB) {
                lbSet.add(num);
            }
        });

        $(".profile + .framearea > .frameareab > div > .charaframe2").each((i, e) => {
            if (lbSet.has(i + 1)) {
                e.classList.add("flowerlb");
            }
        });
    }

    $("<span id='showlbbtn'>上限突破の表示</span>").insertBefore($(".profile + .framearea > .frameareab").prev("p").children("br:last")).one("click", () => applyLBStyleOnFlowers());
})();
