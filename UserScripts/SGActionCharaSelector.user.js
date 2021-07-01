// ==UserScript==
// @name        SGActionCharaSelector
// @namespace   https://twitter.com/11powder
// @description Stroll Greenの各種行動画面のキャラ選択を便利にする
// @include     /^http:\/\/st\.x0\.to\/\?mode=keizoku(?:0|4)(&.*)?$/
// @version     1.0.9
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGActionCharaSelector.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGActionCharaSelector.user.js
// @grant       none
// ==/UserScript==
//
// v1.0.9 -> 対象を基本宣言に拡張した。

await (async () => {
    const skillsClassname = "charaskills";
    const singleSkillClassname = "charasingleskill";
    const docClassname_HiddenEffects = "hiddeneffects";
    const singleSkillClassname_NoCondition = "nocondition";
    const localStorageName_HiddenEffects = "SGActionCharaSelector_ShowNoSkillEffects";

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

        const $insertedSkills = $target.children("." + skillsClassname);
        if ($insertedSkills.length > 0) {
            $insertedSkills.toggle();
            return null;
        }
        else if ($target.is(".charaframe")) {
            // キャラは選択されているがスキル情報は出ていない状態だった
            // スキル情報ロード失敗時などの後にここに来るが、あくまで正常な処理の範疇
            return null;
        }

        const res = await fetch(`http://st.x0.to/?mode=profile&eno=${targetEno}&detail=1`);
        if (!res.ok) {
            $target.append(`<div class="${skillsClassname + "err"}">スキル一覧の取得に失敗しました。</div>`);
            setTimeout(() => $target.find($("." + skillsClassname + "err")).remove(), 3000);
            return "failedloading";
        }

        const html = await res.text();
        const $skills = $(`<div class="${skillsClassname}"/>`).append($(html, _vdoc).find(".cdatal > span.marks.marki0:first").nextAll().andSelf()).appendTo($target);
        processCharaSkillsAfterInsertion($skills);

        return null;
    }

    function processCharaSkillsAfterInsertion($skills) {
        $skills.prepend("<hr class='dashline'>");

        $skills.find("span.marks.marki0").each((i, e) => {
            $(e).nextUntil("hr.dashline").andSelf().wrapAll(`<span class="${singleSkillClassname}"/>`);
        });

        // $skills.find("span.marks.marki0+span").each((i, e) => {
        //     const $type = $(e).children("span");
        //     if ($type.is(".type,.type-1")) {
        //         // セットなし or 基本スキル。花のマークなし
        //         $type.html("&#x3000;");
        //     } else {
        //         const typeName = $type.children("span").html().substr(2, 2);
        //         $type.html("&#x273f;").attr("title", typeName);
        //     }
        // });

        $skills.find("span.marks.marki0+span+span+small>b:empty").each((i, e) => {
            $(e).parent().next("br").next("small").children("span:nth-child(3)").css("color", "#704030;");
        }).closest("." + singleSkillClassname).addClass(singleSkillClassname_NoCondition);
    }

    function enableToggleOfSkillEffects() {
        const $button = $("<span class='sgbutton' style='margin-top:4px;'/>").appendTo($(".charaframe2.charaframeself").prev("p"));
        const toOnText = "スキル効果を表示する";
        const toOffText = "スキル効果の表示を消す";

        if (localStorage.getItem(localStorageName_HiddenEffects)) {
            $button.html(toOnText);
            $(document.body).addClass(docClassname_HiddenEffects);
        } else {
            $button.html(toOffText);
        }

        $button.on("click", () => {
            $(document.body).toggleClass(docClassname_HiddenEffects);
            if (localStorage.getItem(localStorageName_HiddenEffects)) {
                localStorage.removeItem(localStorageName_HiddenEffects);
                $button.html(toOffText);
            } else {
                localStorage.setItem(localStorageName_HiddenEffects, "1");
                $button.html(toOnText);
            }
        });
    }

    let processingEvent = false;
    $("head").append(`
<style type="text/css">
    .block{display:block!important;}
    .inline{display:inline!important;}
    .${skillsClassname}{font-size:small;}
    .${skillsClassname} span.marks.marki0{width:2em;}
    .${skillsClassname} span.marks.marki0+span>span{display:inline-block;}
    .${skillsClassname} span.marks.marki0+span+span{width:calc(10em + 4px)!important;}
    .${docClassname_HiddenEffects} .${skillsClassname} span.marks.marki0+span+span+small+br{display:none;}
    .${skillsClassname} span.marks.marki0+span+span+small+br+small{display:inline-block;padding-left:calc(2em + 4px);}
    .${docClassname_HiddenEffects} .${skillsClassname} span.marks.marki0+span+span+small+br+small{display:none;}
    .${skillsClassname} span.marks.marki0+span+span+small+br+small>span:first-child{padding-left:0!important;}
    .${singleSkillClassname_NoCondition}{opacity:0.6;}
    .sgbutton{
        display: inline-block;
        padding: 3px;
        padding-left: 12px;
        padding-right: 12px;
        border: 1px #997722 solid;
        border-radius: 3px;
        background-color: #ffdd66;
        color: #774400;
        font-weight: bold;
    }
    .sgbutton:hover{
        background-color: #ffee88;
    }
</style>`);
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
    enableToggleOfSkillEffects();
})();
