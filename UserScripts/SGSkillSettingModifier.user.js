// ==UserScript==
// @name        SGSkillSettingModifier
// @namespace   https://twitter.com/11powder
// @description Stroll Greenの戦闘設定を快適にする
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=keizoku1(&.*)?)?$/
// @version     1.0.3.2
// @require     https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGSkillSettingModifier.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGSkillSettingModifier.user.js
// @grant       none
// ==/UserScript==


(() => {
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

    const SKILL_ITEM_CLASSNAME = "skillitem";
    class SortableSkills {
        static init() {
            $(document.head).append(
`<style type="text/css">
    .${SKILL_ITEM_CLASSNAME} > .marks.marki0 {
        padding: auto 4px;
        text-align: left;
    }
    .${SKILL_ITEM_CLASSNAME} > .marks.marki0:before {
        content: "≡";
        display: inline-block;
        width: 15px;
        left: -10px;
        color: white;
        text-align: center;
        border-radius: 2px;
    }

    .sortable-chosen {
        background-color: rgba(255, 165, 0, 0.3);
    }
</style>`);

            // enable doubleclick event
            $(document).on("dblclick", `.${SKILL_ITEM_CLASSNAME}`, function () {
                $(this).find(".skillserif").toggle();
            });

            // and overwriting default toggle event
            let selifIsVisible = false;
            $("#skillseriftoggle").off("click").on("click", function() {
                if (selifIsVisible) {
                    $(".skillserif").hide();
                } else {
                    $(".skillserif").show();
                }
                selifIsVisible = !selifIsVisible;
            });
        }

        constructor($container) {
            this.$container = $container;
        }

        enable() {
            // 0. wrapping
            this.$container.children("hr").last().insertAfter(this.$container).css({ position: "relative", top: "-8px", left: "10px" });
            this.$container.children("hr").each((i, e) => {
                $(e).nextUntil("hr").addBack().wrapAll(`<div class="${SKILL_ITEM_CLASSNAME}"></div>`);
            });
            $("." + SKILL_ITEM_CLASSNAME).each((i, e) => {
                e.dataset.index = i + 1;
            });

            // 1. create sortable.js
            Sortable.create(this.$container[0], {
                animation: 100,
                draggable: "." + SKILL_ITEM_CLASSNAME,
                /* handle: ".marks.marki0", */
                onChange: () => this.resetIndexOfSkills(),
            });
        }

        resetIndexOfSkills() {
            const $skills = $("." + SKILL_ITEM_CLASSNAME);
            this.overwriteIndices($skills);
            this.triggerConnectChange($skills);
            this.triggerEmitChange($skills);
            this.resetDataIndex($skills);
        }

        overwriteIndices($skills) {
            for (let i = 1; i <= $skills.length; i++) {
                // document.getElementById("skill" + i).id = "";
                // const mark = document.getElementById("s" + i);
                // if (mark) {
                //      mark.id = "";
                // }
                // document.getElementById("setdesc" + i).id = "";

                const $skill = $skills.eq(i - 1);
                const prevIndex = $skill.data("index");
                if (prevIndex === i) {
                    continue;
                }

                const selskill = $skill.children(".selskill").get(0);
                selskill.id = selskill.name = "skill" + i;
                const mark = $skill.children(".marks.marki0").get(0);
                mark.id = "s" + i;
                mark.innerHTML = i.toString();
                $skill.children(".skilldesc.skillstroll.skill0").get(0).id = "setdesc" + i;

                $skill.children("select[name^='scond']").get(0).name = "scond" + i;
                const $serif = $skill.children(".skillserif");
                $serif.children("select[name^='icon']").get(0).name = "icon" + i;
                $serif.children("input[type='text'][name^='serif']").get(0).name= "serif" + i;
                $serif.children("[class^='innerserif']").each((_, e) => {
                    e.className = "innerserif" + i;
                });
                $serif.find("input.swap").attr("data-index", i).data("index", i);
            }
        }

        triggerConnectChange($skills) {
            const $connectno = $("select[name='connectno']");
            const connectVal = $connectno.val();
            for (let i = 1; i <= $skills.length; i++) {
                const $skill = $skills.eq(i - 1);
                const prevIndex = $skill.data("index")
                if (prevIndex === i) {
                    continue;
                }
                if (connectVal === prevIndex.toString()) {
                    $connectno.val(i);
                    $connectno[0].dispatchEvent(new Event("change"));
                }
            }
        }

        triggerEmitChange($skills) {
            const $emmitno = $("select[name='emitno']");
            const emitVal = $emmitno.val();
            for (let i = 1; i <= $skills.length; i++) {
                const $skill = $skills.eq(i - 1);
                const prevIndex = $skill.data("index");
                if (prevIndex === i) {
                    continue;
                }
                if (emitVal === prevIndex.toString()) {
                    $emmitno.val(i);
                    $emmitno[0].dispatchEvent(new Event("change"));
                }
            }
        }

        resetDataIndex($skills) {
            for (let i = 1; i <= $skills.length; i++) {
                const $skill = $skills.eq(i - 1);
                $skill.data("index", i);
            }
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

    if ($("#skill1").length !== 1) {
        return;
    }
    SortableSkills.init();
    new SortableSkills($("div.divp")).enable();
})();
