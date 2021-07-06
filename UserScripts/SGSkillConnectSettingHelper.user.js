// ==UserScript==
// @name        SGSkillConnectSettingHelper
// @namespace   https://twitter.com/11powder
// @description Stroll Greenの戦闘画面で、コネクトスキル・エミットスキルの設定を便利にする
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=keizoku1(&.*)?)?$/
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGSkillConnectSettingHelper.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGSkillConnectSettingHelper.user.js
// @grant       none
// ==/UserScript==

(() => {
    "use strict";

    const $connectno = $("select[name='connectno']");
    const $emmitno = $("select[name='emitno']");
    if (!($connectno.length === 1 && $emmitno.length === 1)) {
        return;
    }

    function keepSkillSelectedWhenSwap($swapButton, $select) {
        const selectVal = $select.val();
        if (!selectVal) {
            return;
        }

        const index = $swapButton.data("index");
        if (selectVal === index.toString()) {
            // to downward
            $select.val((index + 1).toString());
        } else if (selectVal === (index + 1).toString()) {
            // to upward
            $select.val(index.toString());
        }
    }

    function insertSkillNameLabelAfterSelect($select) {
        const $label = $("<span class='skillnamelabel'/>").insertAfter($select);
        const $skillSelects = $("select.selskill");

        $select.on("change", function() {
            const strIndex = $(this).val();
            if (!strIndex) {
                updateSkillLabel($label);
            } else {
                const id = $skillSelects.eq(parseInt(strIndex, 10) - 1).val();
                updateSkillLabel($label, id);
            }
        });

        $skillSelects.on("change", function() {
            const id = $(this).val();
            updateSkillLabel($label, id);
        });

        const selectVal = $select.val();
        if (!selectVal) {
            return;
        }
        $skillSelects.eq(parseInt(selectVal, 10) - 1).trigger("change");
    }

    function updateSkillLabel($label, /* optional */ skillId) {
        if (!skillId) {
            $label.html("");
            return;
        }
        const $type = $(`#type${skillId}`);
        if ($type.length !== 1) {
            $label.html("");
            return;
        }
        const $nameAndProp = $type.next("td");
        if ($nameAndProp.length !== 1) {
            return;
        }

        $label.html(`${$type.html().trim()}${$nameAndProp.html().trim()}`);
    }

    $("<style type='text/css'/>").html(`
    .skillnamelabel {
        padding-left: 8px;
    }
    .skillnamelabel > span:first-child {
        margin-left: -8px;
    }
    `).appendTo("head");

    $("input.swap").on("click", function () {
        keepSkillSelectedWhenSwap($(this), $connectno);
        keepSkillSelectedWhenSwap($(this), $emmitno);
    });
    insertSkillNameLabelAfterSelect($connectno);
    insertSkillNameLabelAfterSelect($emmitno);
})();
