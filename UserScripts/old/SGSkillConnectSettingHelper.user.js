// ==UserScript==
// @name        SGSkillConnectSettingHelper
// @namespace   https://twitter.com/11powder
// @description Stroll Greenの戦闘画面で、コネクトスキル・エミットスキルの設定を便利にする
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=keizoku1(&.*)?)?$/
// @version     1.0.2.1
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGSkillConnectSettingHelper.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGSkillConnectSettingHelper.user.js
// @grant       none
// ==/UserScript==

(($) => {
    "use strict";

    class SkillSelectChaser {
        static init() {
            $("<style type='text/css'/>").html(`
    .skillnamelabel {
        padding-left: 8px;
    }
    .skillnamelabel > span:first-child {
        margin-left: -8px;
    }
`).appendTo("head");
        }

        constructor($select) {
            this.$select = $select;
        }

        enable() {
            $("input.swap").on("click", (e) => {
                this.keepSkillSelectedWhenSwap($(e.currentTarget));
            });
            this.insertSkillNameLabelAfterSelect();
        }

        keepSkillSelectedWhenSwap($swapButton) {
            const selectVal = this.$select.val();
            if (!selectVal) {
                return;
            }

            const index = $swapButton.data("index");
            if (selectVal === index.toString()) {
                // to downward
                this.$select.val((index + 1).toString());
            } else if (selectVal === (index + 1).toString()) {
                // to upward
                this.$select.val(index.toString());
            }
        }

        insertSkillNameLabelAfterSelect() {
            const $label = $("<span class='skillnamelabel'/>").insertAfter(this.$select);

            this.$select.on("change", (e) => {
                const strIndex = $(e.currentTarget).val();
                if (!strIndex) {
                    this.updateSkillLabel($label);
                } else {
                    const id = $("select.selskill").eq(parseInt(strIndex, 10) - 1).val();
                    this.updateSkillLabel($label, id);
                }
            });

            $("select.selskill").on("change", (e) => {
                const id = $(e.currentTarget).val();
                this.updateSkillLabel($label, id);
            });

            this.$select.trigger("change");
        }

        updateSkillLabel($label, /* optional */ skillId) {
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
    }

    SkillSelectChaser.init();
    const $connectno = $("select[name='connectno']");
    const $emmitno = $("select[name='emitno']");
    if (!($connectno.length === 1 && $emmitno.length === 1)) {
        return;
    }
    new SkillSelectChaser($connectno).enable();
    new SkillSelectChaser($emmitno).enable();
})(window.$);
