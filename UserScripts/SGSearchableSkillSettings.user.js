// ==UserScript==
// @name        SGSearchableSkillSettings
// @namespace   https://twitter.com/11powder
// @description Stroll Greenのスキル名を検索可能にする
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=keizoku1(&.*)?)?$/
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGSearchableSkillSettings.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGSearchableSkillSettings.user.js
// @grant       none
// ==/UserScript==

(() => {
    "use strict";


    class Delayer {
        setDelay(func, delayMS, /* ...args: any[] */) {
            if (this.id) {
                clearTimeout(this.id);
            }
            this.id = setTimeout((argArray) => {
                this.id = 0;
                func.apply(null, argArray);
            }, delayMS, Array.prototype.slice.call(arguments, 2));
        }
    }

    const MAX_SHOWN_ON_SELECT = 20;
    const HEIGHT_OF_OPTION_ON_SELECT_PX = 20;

    class SearchableSelect {
        static init() {
            $(document.head).append(
                `<style type="text/css">
.searchableselect {
    position: relative;
    display: inline-flex;
    margin: 1px;
    vertical-align: top;
}

.searchableselect_sel {
    display: inline-block;
    position: relative;
    overflow: hidden;
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    text-align: start;
    appearance: auto;
    white-space: pre;
    -webkit-rtl-ordering: logical;
    cursor: default;
    font: 400 13.3333px Arial;
}

.searchableselect_sel.active {
    overflow: visible;
}

.searchableselect_btn {
    display: block;
    position: absolute;
    right: 0;
    background-color: white;
    width: 24px;
    height: 100%;
}
.searchableselect_btn:before {
    content: "";
    position: absolute;
    z-index: 2;
    right: 0;
    display: block;
    width: 24px;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGAQMAAADAPp2FAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABpJREFUeF5jcGhgeHiAobiBwZ6BQY6BgYcBAC73A75PxC48AAAAAElFTkSuQmCC);
}

.searchableselect_sel > .searchableselect_val,
.searchableselect_sel > .searchableselect_pls {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 1px #669966 solid;
    background-color: white;
    border-radius: 2px;
    box-sizing: border-box;
}


.searchableselect_sel > .searchableselect_val {
    opacity: 0;
}

.searchableselect_sel > .searchableselect_val:focus {
    padding-left: 8px;
    position: relative;
    opacity: 1;
    z-index: 1
}

.searchableselect_sel > .searchableselect_pls {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0px;
}

.searchableselect_sel > .searchableselect_val::placeholder {
    color: black;
}

.searchableselect_sel > ul {
    position: relative;
    z-index: 3;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: white;
    color: black;
    border: #767676 solid 1px;
    max-height: calc(${HEIGHT_OF_OPTION_ON_SELECT_PX}px * ${MAX_SHOWN_ON_SELECT});
    list-style-type: none;
    padding-inline-start: 0;
    margin-block-start:  0;
    margin-block-end: 0;
}

.searchableselect_sel > ul > li {
    height: 20px;
    padding-left: 0px;
    text-align: inherit;
}

.searchableselect_sel > ul > li:hover {
    color: white;
    background-color: #4b89fc;
}

.searchableselect_sel > ul > li:hover > span:nth-of-type(3) {
    color: white!important;
}

.searchableselect_sel.active > ul {
    box-shadow: 0px 5px 10px rgb(0 0 0 / 20%);
}

.searchableselect_sel.active > ul > li {
    font-weight: normal;
    white-space: nowrap;
    min-height: 1.2em;
    padding: 0px 2px 1px;
}

.searchableselect_sel .marks.marki0 {
    width: 2.67em;
}
</style>`);

            $("div.divp").parent().css("overflow", "clip visible");
        }

        constructor(excludesBaseSkills) {
            this.excludesBaseSkills = excludesBaseSkills;
            this.$ul = this.$buildSkillList();

            this.$ul.on("click", "li", (e) => {
                const $searchable = $(e.currentTarget).closest(".searchableselect");
                const $baseSelect = $searchable.prev();
                const $sel = $searchable.find(".searchableselect_sel");
                $baseSelect.val($(e.currentTarget).data("skillid")).trigger("change");
                $searchable.find(".searchableselect_pls").html(e.currentTarget.innerHTML);
                const index = this.$ul.children("li").index(e.currentTarget);
                $sel[0].dataset.index = index;
                this.deactivateSelect($sel);
            });

            this.evtDelayer = new Delayer();
        }

        enable($baseSelects) {
            if (!$baseSelects.length) {
                return;
            }

            this.$searchables = $baseSelects.after("<div class='searchableselect'><div class='searchableselect_btn'></div><div class='searchableselect_sel'><div class='searchableselect_pls'></div><input type='text' class='searchableselect_val'></div></div>").next();
            this.$sels = this.$searchables.children(".searchableselect_sel");
            this.$vals = this.$sels.children(".searchableselect_val");
            this.$btns = this.$searchables.children(".searchableselect_btn");
            this.$pls = this.$sels.children(".searchableselect_pls");

            this.$sels.eq(0).append(this.$ul);

            this.$ul[0].style.display = "inline-block"; // for width

            this.idToIndexhash = {};
            this.$ul.children().each((i, e) => {
                this.idToIndexhash[e.dataset.skillid] = i;
            });

            const skillIdxs = $baseSelects.map((i, e) => this.idToIndexhash.hasOwnProperty(e.value) ? this.idToIndexhash[e.value] : -1).get();

            this.$sels.each((i, e) => {
                e.dataset.index = skillIdxs[i];
            }).css({
                height: $baseSelects.outerHeight(),
                width: this.$ul.width(),
            });
            this.$ul[0].style.display = "";

            this.$pls.each((i, e) => {
                e.innerHTML = this.$ul.children().eq(skillIdxs[i]).html();
            });

            this.$btns.on("click", (e) => {
                this.toggleSelect($(e.currentTarget).next());
            });

            this.$vals.on("click", (e) => {
                this.activateSelect($(e.currentTarget).parent());
            }).on("keydown", (e) => {
                if (e.keyCode === 13 /* enter */) {
                    e.preventDefault();
                }
            }).on("keyup", (evt) => {
                this.evtDelayer.setDelay((elem) => this.execFiltering(elem), 150, evt.currentTarget);
            });

            $(document).on("click", (e) => {
                if (!$(e.target).closest(".searchableselect").length) {
                    this.deactivateSelect($(".searchableselect_sel.active"));
                }
            });

            $baseSelects.hide();
        }

        $buildSkillList() {
            const lisHtml = $("table#skill tr").slice(0).map((i, e) => {
                if (i === 0) {
                    return `<li data-skillid="0"><span class="marks marki0">0</span><span>　</span>--設定なし--</li>`;
                }

                const $tds = $(e).children("td");
                const index = $tds.eq(0).html();
                let type = $tds.eq(1).html();
                if (type === "　　　　　") {
                    if (this.excludesBaseSkills) {
                        return "";
                    }
                    type = "<span>　</span>";
                } else {
                    const typeName = $tds.eq(1).text().substr(2, 2);
                    type = `<span class="${$tds.eq(1).children()[0].className}" title="${typeName}">✿</span>`;
                }
                const skillName = $tds.eq(2).html();
                const innerHTML = index + type + skillName;

                const skillid = $tds.eq(1).attr("id").substr(4);

                return `<li data-skillid="${skillid}">${innerHTML}</li>`;
            }).get()
            .join("");

            return $(`<ul>${lisHtml}</ul>`);
        }

        execFiltering(input) {
            if (!input) {
                return;
            }

            const val = input.value;
            if (!val) {
                this.$ul.children().show();
                return;
            }

            this.$ul.children().each((i, e) => {
                if (e.innerHTML.indexOf(val) !== -1) {
                    e.style.display = "";
                } else {
                    e.style.display = "none";
                }
            });
        }

        clearFilter() {
            this.$ul.children().show();
        }

        toggleSelect($sel) {
            if ($sel.hasClass("active")) {
                this.deactivateSelect($sel);
            } else {
                this.activateSelect($sel);
            }
        }

        activateSelect($sel) {
            if ($sel.hasClass("active")) {
                return;
            }
            $sel.addClass("active");

            $sel.append(this.$ul);
            const index = $sel[0].dataset.index;
            if (index === "-1") {
                return;
            }

            this.clearFilter();
            const $activeLi = this.$ul.children("li").eq(index);
            const top = index < MAX_SHOWN_ON_SELECT ? 0 : (index - MAX_SHOWN_ON_SELECT + 2) * (HEIGHT_OF_OPTION_ON_SELECT_PX + 1);
            this.$ul.scrollTop(top);

            $sel.find(".searchableselect_val").attr("placeholder", $activeLi.text());
        }

        deactivateSelect($sel) {
            if (!$sel.hasClass("active")) {
                return;
            }
            $sel.find(".searchableselect_val").val("").attr("placeholder", "");
            $sel.removeClass("active");
        }
    }

    window.reloadSkill = function reloadSkill(){
        $(".selskill").each((i, e) => {
            const skillId = $(e).val();
            const stype = $("#type"+skillId).html();
            const $desc = $("#desc"+skillId);
            const sdesc = $desc.html();
            $(e).next().next().html(stype + sdesc).attr("title", $desc.text());
        });
    };

    if ($("#skill1").length !== 1) {
        return;
    }

    SearchableSelect.init();
    new SearchableSelect().enable($(".selskill"));
    const $kouhai = $("select[name='kouhai_base']").add("select[name='kouhai_mix']");
    new SearchableSelect(true).enable($kouhai);
    $kouhai.next().css("margin-top", "-4px");
    reloadSkill();
})();
