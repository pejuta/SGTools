// ==UserScript==
// @name        SGFlowerDicEnhancer
// @namespace   https://twitter.com/11powder
// @description 花図鑑の上限突破を簡単に確認できるようにしたり、モード変更を簡単にしたりする。
// @match       http://st.x0.to/?mode=zukan*
// @version     1.0.4.1
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGFlowerDicLBMarker.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGFlowerDicLBMarker.user.js
// @grant       none
// ==/UserScript==

(() => {
    "use strict";

    function alertResponseError(res) {
        alert(res.statusText + " " + res.status);
    }

    class FlowerDic {
        constructor($frame) {
            if ($frame.length !== 1) {
                throw new Error("invalid argument");
            }

            // array
            this.flowers = null;
            this.sFlowerNames = null;

            if ($frame.children(".talkarea").length) {
                this.$simple = null;
                this.$detailed = $frame;
                this.buildFlowers();
            } else if ($frame.children(".frameareab").length) {
                this.$simple = $frame;
                this.$detailed = null;
                this.appendSimpleDicLBButton();
                this.extractSimpleFlowerNames();
            } else {
                throw new Error("invalid operation");
            }

            this._vdoc = document.implementation.createHTMLDocument();

            this.$fTooltip = $(`<div id="ftooltip"/>`).appendTo(document.body);

            $(document.head).append(
`<style type="text/css">
    .charaframe2 {
        position: relative;
    }

    .charaframe2 > .flevels {
        display: none;
        position: absolute;
        right: 1px;
        bottom: -3px;
        font-size: 12px;
        font-weight: normal;
    }

    .highlightlb .charaframe2 > .flevels {
        display: block;
    }

    .highlightlb .charaframe2.flowerlb {
        border-width: 3px;
        border-color: #ffbb44;
        margin: 6px;
    }

    .highlightlb .charaframe2.flowerlb:before {
        content: "＋";
        display: block;
        position: absolute;
        right: 0;
        top: -2px;
        font-size: 20px;
        color: #ffbb44;
        font-weight: bold;
    }

    .profile ~ .framearea > .talkarea > img,
    .profile ~ .framearea > .frameareab > div > .charaframe2 > img {
        cursor: pointer;
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

    #ftooltip {
        display: block;
        position: absolute;
        width: 600px;
        pointer-events: none;
    }

    #ftooltip > .talkarea {
        background: white;
        border: 1px #996633 dashed;
    }
</style>`
            );
        }

        // static getEnoFromLocation() {
        //     const m = /eno=(\d+)/.exec(location.search);
        //     if (!m) {
        //         return "";
        //     }
        //     return m[1];
        // }

        enableAjaxToggle() {
            $(document).on("click", ".profile ~ .framearea > p:first-of-type > a:first-of-type", async (e) => {
                if (e.ctrlKey || e.shiftKey || e.altKey) {
                    return;
                }
                e.preventDefault();
                await this.switchFrames();
            });

            $(document).on("click", ".profile ~ .framearea > .talkarea > img", async (evt) => {
                const $thisFlower = $(evt.currentTarget).parent(".talkarea");
                if (!await this.switchFrames()) {
                    return;
                }

                if (!this.sFlowerNames) {
                    return;
                }

                const name = Flower.getNameFromDetailed($thisFlower);

                const simpleFlowerIndex = this.sFlowerNames.indexOf(name);
                if (simpleFlowerIndex !== -1) {
                    this.$simple.children(".frameareab").children("div").children(".charaframe2").get(simpleFlowerIndex).scrollIntoView(false);
                }
            });

            $(document).on("click", ".profile ~ .framearea > .frameareab > div > .charaframe2 > img", async (evt) => {
                const $thisFlower = $(evt.currentTarget).parent(".charaframe2");
                const name = Flower.getNameFromSimple($thisFlower);
                if (name === "？？？？") {
                    return;
                }

                if (!await this.switchFrames()) {
                    return;
                }

                if (!this.flowers) {
                    return;
                }

                const detailedFlowerIndex = this.flowers.findIndex(x => x.name === name);
                if (detailedFlowerIndex !== -1) {
                    this.$detailed.children(".talkarea").get(detailedFlowerIndex).scrollIntoView(false);
                }
            });
        }

        $getCurrentFrame() {
            if (this.$simple && this.$simple.is(":visible")) {
                return this.$simple;
            } else if (this.$detailed && this.$detailed.is(":visible")) {
                return this.$detailed;
            }
            throw new Error("invalid operation");
        }

        async switchFrames() {
            if (!await this.loadAnotherFrame()) {
                return false;
            }
            this.pushHistoryOfCurrent();
            await this.fadeSwitchFrames();
            return true;
        }

        async loadAnotherFrame() {
            if (!!this.$simple === !!this.$detailed) {
                // includes 'loaded' state here
                return !!this.$simple;
            }
            const $currentFrame = this.$getCurrentFrame();
            const currentIsSimple = $currentFrame === this.$simple;

            const $switchDicA = $currentFrame.children("p:first-of-type").children("a:first-of-type");
            const targetUrl = $switchDicA.attr("href");
            const res = await fetch(targetUrl);
            if (!res.ok) {
                alertResponseError(res);
                return false;
            }
            const html = await res.text();
            const $anotherFrame = $(html, this._vdoc).find(".profile ~ .framearea").hide();

            if (currentIsSimple) {
                $anotherFrame.insertBefore($currentFrame);
                this.$detailed = $anotherFrame;
                this.buildFlowers();
            } else {
                $anotherFrame.insertAfter($currentFrame);
                this.$simple = $anotherFrame;
                this.appendSimpleDicLBButton();
                this.extractSimpleFlowerNames();
            }

            this.enableDetailedFlowerTooltip();

            return true;
        }

        async fadeSwitchFrames() {
            if (!(this.$simple && this.$detailed)) {
                return;
            }

            await new Promise((resolve) => {
                const $frames = this.$simple.add(this.$detailed);

                const $hidden = $frames.filter(":hidden");
                const $visible = $frames.filter(":visible");
                $visible.fadeOut(200, () => $hidden.fadeIn(200, () => resolve()));
            });
        }

        pushHistoryOfCurrent() {
            const $switchDicA = this.$getCurrentFrame().children("p:first-of-type").children("a:first-of-type");
            history.pushState("", "", $switchDicA.attr("href"));
        }

        appendSimpleDicLBButton() {
            if (!this.$simple || this.$simple.find("#showlbbtn").length > 0) {
                return;
            }
            const $lastBrToInsertBefore = this.$simple.children(".frameareab").prev("p").children("br:last");
            if ($lastBrToInsertBefore.length === 0) {
                return;
            }
            $("<span id='showlbbtn'>図鑑情報拡張・表示切り替え</span>").insertBefore($lastBrToInsertBefore).on("click", async () => {
                await this.loadAnotherFrame();
                this.applyLBStyleOnSimpleFlowers();
            });
        }

        enableDetailedFlowerTooltip() {
            if (!(this.$detailed && this.$simple && this.$fTooltip && this.flowers)) {
                return;
            }

            const $detailedFlowers = this.$detailed.children(".talkarea");

            $(document).on("mousemove", ".profile ~ .framearea > .frameareab > div > .charaframe2", (e) => {
                const $sFlower = $(e.currentTarget);
                const name = Flower.getNameFromSimple($sFlower);

                const detailedFlowerIndex = this.flowers.findIndex(x => x.name === name);
                if (detailedFlowerIndex === -1) {
                    this.$fTooltip.hide();
                    return;
                }

                const $dFlower = $detailedFlowers.eq(detailedFlowerIndex);

                let left = e.pageX;
                let top = e.pageY;
                if (e.clientX + this.$fTooltip.width() > window.innerWidth && e.clientX * 2 > window.innerWidth) {
                    // はみ出る、かつマウスカーソルが中央より右にある時にツールチップをマウスカーソルの左に表示
                    left = e.pageX - this.$fTooltip.width();
                }
                if (e.clientY + this.$fTooltip.height() > window.innerHeight && e.clientY * 2 > window.innerHeight) {
                    // はみ出る、かつマウスカーソルが中央より下にある時にツールチップをマウスカーソルの左に表示
                    top = e.pageY - this.$fTooltip.height();
                }

                this.$fTooltip.empty().append($dFlower.clone()).css({ left, top }).show();
            }).on("mouseleave", ".profile ~ .framearea > .frameareab > div > .charaframe2", (e) => {
                this.$fTooltip.hide();
            });

        }

        buildFlowers() {
            if (!this.$detailed) {
                return;
            }

            this.flowers = this.$detailed.children(".talkarea").map((i, e) => new Flower($(e))).get();
        }

        extractSimpleFlowerNames() {
            if (!this.$simple) {
                return;
            }

            this.sFlowerNames = this.$simple.children(".frameareab").children("div").children(".charaframe2").children("b").map((i, e) => e.innerHTML).get();
        }

        applyLBStyleOnSimpleFlowers() {
            if (!(this.$simple && this.$detailed && this.flowers && this.sFlowerNames)) {
                return;
            }

            const $markedFrames = $(".charaframe2.flowerlb");
            if ($markedFrames.length > 0) {
                this.$simple.toggleClass("highlightlb");
                return;
            }

            const $detailedFlowers = this.$detailed.children(".talkarea");
            const $simpleFlowers = this.$simple.children(".frameareab").children("div").children(".charaframe2");

            this.flowers.forEach((f) => {
                const simpleFlowerIndex = this.sFlowerNames.indexOf(f.name);
                const $targetFlower = $simpleFlowers.eq(simpleFlowerIndex);
                $targetFlower.prepend(`<span class="flevels">${f.reachedLevel}/${f.maxLevel}</span>`);
                if (f.hasBrokenLimit()) {
                    $targetFlower.addClass("flowerlb");
                }
            });

            this.$simple.addClass("highlightlb");
        }
    }

    class Flower {
        constructor($detailed) {
            if (!$detailed) {
                throw new Error("argument null");
            }

            this.name = Flower.getNameFromDetailed($detailed);
            this.number = Flower.extractFlowerNum($detailed);
            this.reachedLevel = Flower.getReachedLevel($detailed);
            this.maxLevel = Flower.getMaxLevel($detailed);
        }

        hasBrokenLimit() {
            return this.reachedLevel > this.maxLevel;
        }

        static getNameFromSimple($simple) {
            return $simple.children("b").html();
        }

        static getNameFromDetailed($detailed) {
            return $detailed.children("b:first-of-type").html().split("　")[1];
        }

        static getReachedLevel($detailed) {
            return $detailed.children("small:last-of-type").children("b").filter((i, b) => {
                return !b.innerHTML.endsWith("？");
            }).length;
        }

        static getMaxLevel($detailed) {
            const $levels = $detailed.children("small:last-of-type").children("b");
            const lastIsLB = $levels.last().filter((i, b) => {
                return $(b).attr("style") === "color: #30aa10;";
            }).length > 0;
            if (lastIsLB) {
                return $levels.length - 1;
            } else {
                return $levels.length;
            }
        }

        static extractFlowerNum($detailed) {
            return parseInt($detailed.children("b:first-of-type").html().split("　")[0].slice(4), 10);
        }
    }

    const $dic = new FlowerDic($(".profile ~ .framearea"));
    $dic.enableAjaxToggle();
})();
