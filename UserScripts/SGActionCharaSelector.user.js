// ==UserScript==
// @name        SGActionCharaSelector
// @namespace   https://twitter.com/11powder
// @description Stroll Greenの各種行動画面のキャラ選択を便利にする
// @include     http://st.x0.to/?mode=keizoku4*
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGActionCharaSelector.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGActionCharaSelector.user.js
// @grant       none
// ==/UserScript==

await (async () => {
    const skillsClassname = "charaskills";

    const _vdoc = document.implementation.createHTMLDocument();
    const $inputEnos = $("#d1,#d2,#d3");
    function toggleSelectedChara($target) {
        if (!$target.is(".charaframe,.charaframe2")) {
            return;
        }

        const targetEno = $target.data("eno") + "";

        const $inputWithSameValue = $inputEnos.filter((i, e) => e.value === targetEno);
        const $firstEmptyInput = $inputEnos.filter((i, e) => e.value === "").first();
        if ($inputWithSameValue.length > 0) {
            $inputWithSameValue.each((i, e) => e.value = "");
        } else if ($firstEmptyInput.length > 0) {
            $firstEmptyInput.val(targetEno);
        } else {
            return;
        }

        $target.toggleClass("charaframe").toggleClass("charaframe2");
        $target.find(".tubuyaki").toggleClass("inline");
        $target.find(".pin").toggleClass("block");
    }

    async function toggleSkillsOfSelectedChara($target) {
        if (!$target.is(".charaframe,.charaframe2")) {
            return;
        }

        const targetEno = $target.data("eno") + "";

        const $skills = $target.children("." + skillsClassname);
        if ($skills.length > 0) {
            $skills.toggle();
            return;
        }

        const res = await fetch(`http://st.x0.to/?mode=profile&eno=${targetEno}`);
        if (!res.ok) {
            $target.append(`<div class="${skillsClassname + "err"}">スキル一覧の取得に失敗しました。</div>`);
            setTimeout(() => $target.find($("." + skillsClassname + "err")).remove(), 3000);
            return;
        }

        const html = await res.text();
        $(`<div class="${skillsClassname}"/>`).append($(html, _vdoc).find(".cdatal > span.marks.marki0:first").nextAll().andSelf()).appendTo($target);
    }

    $("head").append(`<style type="text/css">.block{display:block;}.inline{display:inline;}.${skillsClassname}{font-size:8px;}</style>`);
    $(".charaframe").off("click").on("click", async function() {
        toggleSelectedChara($(this));
        await toggleSkillsOfSelectedChara($(this));
    });
    $(".charaframeself").on("click", async function() {
        await toggleSkillsOfSelectedChara($(this));
    });
})();
