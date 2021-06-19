// ==UserScript==
// @name        SGActionCharaSelector
// @namespace   https://twitter.com/11powder
// @description Stroll Greenの各種行動画面のキャラ選択を便利にする
// @include     http://st.x0.to/?mode=keizoku4*
// @version     1.0.4
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGActionCharaSelector.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGActionCharaSelector.user.js
// @grant       none
// ==/UserScript==

await (async () => {
    const skillsClassname = "charaskills";

    const _vdoc = document.implementation.createHTMLDocument();
    const $inputEnos = $("#d1,#d2,#d3");

    // .charaframeselfに対してバインドしてはならない
    function toggleSelectedChara($target) {
        if (!$target.is(".charaframe,.charaframe2")) {
            return "notcharaframe";
        }

        const targetEno = $target.data("eno") + "";

        const $inputWithSameValue = $inputEnos.filter((i, e) => e.value === targetEno);
        const $firstEmptyInput = $inputEnos.filter((i, e) => e.value === "").first();
        if ($inputWithSameValue.length > 0) {
            $inputWithSameValue.each((i, e) => e.value = "");
        } else if ($firstEmptyInput.length > 0) {
            $firstEmptyInput.val(targetEno);
        } else {
            return "noemptyslot";
        }

        $target.toggleClass("charaframe").toggleClass("charaframe2");
        $target.find(".tubuyaki").toggleClass("inline");
        $target.find(".pin").toggleClass("block");

        return null;
    }

    // toggleSelectedCharaとともに呼ぶ順序によって結果が変わるため要注意
    async function toggleSkillsOfSelectedChara($target) {
        if (!$target.is(".charaframe,.charaframe2")) {
            // .charaframe2 は .charaframeself のブロックにも付与されている
            return "notcharaframe";
        }

        const targetEno = $target.data("eno") + "";

        const $skills = $target.children("." + skillsClassname);
        if ($skills.length > 0) {
            $skills.toggle();
            return null;
        }
        else if ($target.is(".charaframe")) {
            // キャラは選択されているがスキル情報は出ていない状態だった
            // スキル情報ロード失敗時などの後にここに来るが、あくまで正常な処理の範疇
            return null
        }

        const res = await fetch(`http://st.x0.to/?mode=profile&eno=${targetEno}`);
        if (!res.ok) {
            $target.append(`<div class="${skillsClassname + "err"}">スキル一覧の取得に失敗しました。</div>`);
            setTimeout(() => $target.find($("." + skillsClassname + "err")).remove(), 3000);
            return "failedloading";
        }

        const html = await res.text();
        $(`<div class="${skillsClassname}"/>`).append($(html, _vdoc).find(".cdatal > span.marks.marki0:first").nextAll().andSelf()).appendTo($target);

        return null;
    }

    let processingEvent = false;
    $("head").append(`<style type="text/css">.block{display:block!important;}.inline{display:inline!important;}.${skillsClassname}{font-size:8px;}</style>`);
    $(".charaframe").off("click").on("click", async function() {
        if (processingEvent) return;
        processingEvent = true;
        try {
            if (toggleSelectedChara($(this))) return;
            if (await toggleSkillsOfSelectedChara($(this))) return;
        }
        finally {
            processingEvent = false;
        }
    });
    $(".charaframeself").on("click", async function() {
        if (processingEvent) return;
        processingEvent = true;
        try {
            if (await toggleSkillsOfSelectedChara($(this))) return;
        }
        finally {
            processingEvent = false;
        }
    });
})();
