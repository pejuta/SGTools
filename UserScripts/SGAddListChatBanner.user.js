// ==UserScript==
// @name        SGAddListChatBanner
// @namespace   https://twitter.com/11powder
// @description チャット：リンクのバナーを左サイドバーに表示する
// @include     http://st.x0.to*
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGAddListChatBanner.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGAddListChatBanner.user.js
// @grant       none
// ==/UserScript==

(function() {
    'use strict';
    $("a[href='./?mode=chat']").after(`<a href="./?mode=chat&list=8" class="nav" style="white-space:pre-wrap;"><div class="navlink" style="padding:6px 0 10px;">チャット
（リスト）</div></a>`);
})();