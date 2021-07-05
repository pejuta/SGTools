// ==UserScript==
// @name        SGIconSwapper
// @namespace   https://twitter.com/11powder
// @description キャラ設定でアイコンを入れ替えられるようにする
// @include     http://st.x0.to/?mode=keizoku3*
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGIconSwapper.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGIconSwapper.user.js
// @grant       none
// ==/UserScript==

(() => {
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
		$e.wrapAll(`<span class="iconrow" data-index="${i}"/>`);
	});

	const iconCount = $iconCntSets.length;
	$(".iconrow").prepend("<span><i class='spinnerup'>↑</i><i class='spinnerdown'>↓</i></span>");

	$(".spinnerup").on("click", function() {
		const $row = $(this).parent().parent();
		const index = $row.data("index");
		if (index === 0) {
			return;
		}

		const $prevInputs = $row.prev(".iconrow").children("input");
		if ($prevInputs.length === 0) {
			return;
		}

		const $inputs = $(this).parent().siblings("input");
		const nameTemp = $inputs.eq(0).val();
		$inputs.eq(0).val($prevInputs.eq(0).val());
		$prevInputs.eq(0).val(nameTemp);

		const urlTemp = $inputs.eq(1).val();
		$inputs.eq(1).val($prevInputs.eq(1).val());
		$prevInputs.eq(1).val(urlTemp);

		const speakerTemp = $inputs.eq(2).val();
		$inputs.eq(2).val($prevInputs.eq(2).val());
		$prevInputs.eq(2).val(speakerTemp);
	});

	$(".spinnerdown").on("click", function() {
		const $row = $(this).parent().parent();
		const index = $row.data("index");
		if (index === iconCount - 1) {
			return;
		}

		const $nextInputs = $row.next(".iconrow").children("input");
		if ($nextInputs.length === 0) {
			return;
		}

		const $inputs = $(this).parent().siblings("input");
		const nameTemp = $inputs.eq(0).val();
		$inputs.eq(0).val($nextInputs.eq(0).val());
		$nextInputs.eq(0).val(nameTemp);

		const urlTemp = $inputs.eq(1).val();
		$inputs.eq(1).val($nextInputs.eq(1).val());
		$nextInputs.eq(1).val(urlTemp);

		const speakerTemp = $inputs.eq(2).val();
		$inputs.eq(2).val($nextInputs.eq(2).val());
		$nextInputs.eq(2).val(speakerTemp);
	});

    $("<style type='text/css'/>").html(
`.spinnerup,.spinnerdown{
    padding: 0 4px;
    margin-right: 2px;
    border: 1px #997722 solid;
    border-radius: 3px;
    background-color: #ffdd66;
    color: #774400;
    font-weight: bold;
    cursor: pointer;
}`).appendTo("head");
})();

