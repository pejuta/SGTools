// ==UserScript==
// @name        SGIconSwapper
// @namespace   https://twitter.com/11powder
// @description キャラ設定でアイコンを入れ替えられるようにする
// @include     /^http:\/\/st\.x0\.to\/?(?:\?mode=keizoku3(&.*)?)?$/
// @version     1.0.2
// @require     https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGIconSwapper.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGIconSwapper.user.js
// @grant       none
// ==/UserScript==
//
// v1.0.1 -> 送信後にスクリプトが無効化される不具合に対処。

(() => {
    const $targetSubtitle = $("h2.subtitle").filter((i, e) => e.innerHTML === "キャラクター設定");
    if ($targetSubtitle.length === 0) {
        return;
    }

    // 最初以外の.label
    const $labels = $("input[name*='icon'][name$='c']+br+span.label");
    const $conts = $labels.first().parent().contents();

    if ($labels.length < 2) {
        return;
    }

    const idxsExcfirst = $labels.get().map((e, i) => {
        return $conts.index(e);
    });

    const width = idxsExcfirst[1] - idxsExcfirst[0];
    const begin = idxsExcfirst[0] - width;

    const idxs = [begin].concat(idxsExcfirst);

    const $iconCntSets = idxs.map((b, i) => {
        return $conts.slice(b, b + width);
    });
    $iconCntSets.forEach(($e, i) => {
        $e.wrapAll(`<span class="iconrow" data-initindex="${i}" data-index="${i}"/>`);
        $e.parent(".iconrow").prepend("<span class='dhandle'>≡</span>");
    });

    $(".iconrow").wrapAll(`<div class="iconcnt"/>`);
    Sortable.create($(".iconcnt")[0], {
        animation: 100,
        draggable: ".iconrow",
        handle: ".dhandle",
        onChange: () => resetIndexOfIcons(),
    });

    function resetIndexOfIcons() {
        $(".iconrow").each((i, e) => {
            $(e).data("index", i).attr("data-index", i);
            const index = i + 1;
            const ce = $(e).children();
            ce.eq(1).html(`<b>ICON${("00" + index).slice(-2)}</b>`);
            ce.eq(2).attr("name", `icon${index}n`).attr("id", `icon${index}n`);
            ce.eq(3).attr("name", `icon${index}`).attr("id", `icon${index}`);
            ce.eq(4).attr("name", `icon${index}c`).attr("id", `icon${index}c`);
        });
    }

    $("<style type='text/css'/>").html(
`
.dhandle{
    display: inline;
    padding: 0 10px;
    margin-right: 2px;
    border-radius: 3px;
    background-color: #ffdd66;
    color: #774400;
    font-weight: bold;
    cursor: pointer;
}
`).appendTo("head");
})();
