// ==UserScript==
// @name        SGFlowerDicEnhancer
// @namespace   https://twitter.com/11powder
// @description 花図鑑の上限突破を簡単に確認できるようにしたり、モード変更を簡単にしたりする。
// @match       http://st.x0.to/?mode=zukan*
// @version     1.0.1
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

    function alertResponseError(req) {
        alert(res.statusText + " " + res.status);
    }

    function getEnoFromLocation() {
        const m = /eno=(\d+)/.exec(location.search);
        if (!m) {
            return "";
        }
        return m[1];
    }

    const _vdoc = document.implementation.createHTMLDocument();
    async function loadOtherDicModeFrame() {
        if ($(".profile ~ .framearea:hidden").length > 0) {
            return true;
        }

        const $switchDicA = $(".profile ~ .framearea").children("p:first-of-type").children("a:first-of-type");
        const targetUrl = $switchDicA.attr("href");
        const res = await fetch(targetUrl);
        if (!res.ok) {
            alertResponseError(res);
            return false;
        }
        const html = await res.text();
        $(html, _vdoc).find(".profile ~ .framearea").hide().insertAfter($(".profile ~ .framearea"));

        appendSimpleDicButton();

        $(".profile ~ .framearea").children("p:first-of-type").children("a:first-of-type").on("click", (e) => {
            e.preventDefault();
            switchDicModes(e.currentTarget);
        });

        return true;
    }

    async function loadThenSwitchDicModes() {
        const $switchDicA = $(".profile ~ .framearea").children("p:first-of-type").children("a:first-of-type");
        if (!await loadOtherDicModeFrame()) {
            return false;
        }
        await switchDicModes($switchDicA[0]);

        return true;
    }

    async function switchDicModes(anch) {
        history.pushState("", "", $(anch).attr("href"));
        await fadeSwitchFrames();
    }

    function fadeSwitchFrames() {
        return new Promise((resolve) => {
            const $hidden = $(".profile ~ .framearea:hidden");
            const $visible = $(".profile ~ .framearea:visible");
            $visible.fadeOut(200, () => $hidden.fadeIn(200, () => resolve()));
        });
    }

    function appendSimpleDicButton() {
        if ($("#showlbbtn").length > 0) {
            return;
        }
        const $lastBrToInsertBefore = $(".profile ~ .framearea > .frameareab").prev("p").children("br:last");
        if ($lastBrToInsertBefore.length === 0) {
            return;
        }
        $("<span id='showlbbtn'>上限突破の表示切り替え</span>").insertBefore($lastBrToInsertBefore).on("click", async () => {
            await loadOtherDicModeFrame();
            toggleLBStyleOnFlowers();
        });
    }

    function extractDetailedFlowerNum(flower) {
        return parseInt($(flower).children("b:first-of-type").html().split("　")[0].slice(4), 10);
    }

    function toggleLBStyleOnFlowers() {
        const $markedFrames = $(".charaframe2.flowerlb");
        if ($markedFrames.length > 0) {
            $markedFrames.removeClass("flowerlb");
            return;
        }

        const $simpleFlowers = $(".profile ~ .framearea > .talkarea");
        if ($simpleFlowers.length === 0) {
            return;
        }

        const lbSet = new Set();
        $simpleFlowers.each((i, e) => {
            const num = extractDetailedFlowerNum(e);
            const isLB = $(e).children("small:last").children("b").filter((i, b) => {
                return $(b).attr("style") === "color: #30aa10;";
            }).length > 0;
            if (isLB) {
                lbSet.add(num);
            }
        });

        $(".profile ~ .framearea > .frameareab > div > .charaframe2").each((i, e) => {
            if (lbSet.has(i + 1)) {
                e.classList.add("flowerlb");
            }
        });
    }

    appendSimpleDicButton();

    $(".profile ~ .framearea").children("p:first-of-type").children("a:first-of-type").one("click", async (e) => {
        e.preventDefault();
        await loadThenSwitchDicModes();
    });

    $(document).on("click", ".profile ~ .framearea > .talkarea > img", async (evt) => {
        const $thisFlower = $(evt.currentTarget).parent(".talkarea");
        const num = extractDetailedFlowerNum($thisFlower);
        if (!await loadThenSwitchDicModes()) {
            return;
        }
        const $simple = $(".profile ~ .framearea > .frameareab > div > .charaframe2");
        $simple.eq(num - 1)[0].scrollIntoView(false);
    });
    $(document).on("click", ".profile ~ .framearea > .frameareab > div > .charaframe2 > img", async (evt) => {
        const $thisFlower = $(evt.currentTarget).parent(".charaframe2");
        if (evt.currentTarget.style.opacity) {
            // ????
            return;
        }
        const $simple = $(".profile ~ .framearea > .frameareab > div > .charaframe2");
        const index = $simple.index($thisFlower);
        if (!await loadThenSwitchDicModes()) {
            return;
        }
        const $targetDetailed = $(".profile ~ .framearea > .talkarea").filter((i, e) => {
            const num = extractDetailedFlowerNum(e);
            return index === num - 1;
        });
        if ($targetDetailed.length > 0) {
            $targetDetailed[0].scrollIntoView(false);
        }
    });
})();
