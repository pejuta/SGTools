// ==UserScript==
// @name        SGFavChat
// @namespace   https://twitter.com/11powder
// @description お気に入りのチャットを保存するやつ
// @include     http://st.x0.to/?mode=chat*
// @version     1.0.0
// @updateURL   https://pejuta.github.io/SGTools/UserScripts/SGFavChat.user.js
// @downloadURL https://pejuta.github.io/SGTools/UserScripts/SGFavChat.user.js
// @grant       none
// ==/UserScript==
!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=8)}([function(t,e){t.exports='<div class="talkarea talkmain">\r\n    <div style="display: table;">{BODY_HTML}</div>\r\n    <div style="text-align:right;"><span class="{BODY_CLASS_NAME}">{LOCK_HTML}\r\n    <span class="times">{TIMEINFO_HTML}</span>\r\n    &nbsp;<small class="res" style="cursor: pointer; color: #997766;" data-restid="{ID}"><a class="ri-reply-fill" href="http://st.x0.to/?mode=chat&list={CHATLIST_INDEX}&rootid={TREE_ID}" target="_blank"></a></small>\r\n\r\n    </span>\r\n    </div>\r\n</div>'},function(t,e){t.exports='<i class="ri-lock-fill"></i>'},function(t,e){t.exports='<div id="FavLine">\r\n    <div id="FavLineNav">\r\n        <div>\r\n            <div id="FavControl">\r\n                <div id="FavControlMessage"></div>\r\n                <div>お気に入りデータ管理</div>\r\n                <div id="ExportFavs" class="FavButton FavBut1">ファイル出力</div>\r\n                <div id="ImportFavs" class="FavButton FavBut2">ファイル入力</div>\r\n                <div> </div>\r\n                <div id="DeleteFavs" class="FavButton FavBut3">全消去</div>\r\n            </div>\r\n        </div>\r\n        <div id="FavSearchBar">\r\n            <div id="FavLinePrev" class="FavButton"></div>\r\n            <div id="FavSearch">\r\n                <span>検索： </span>\r\n                <input type="text" class="TXT">\r\n                <select class="ARE">\r\n                    <option value="0">降順</option>\r\n                    <option value="1">昇順</option>\r\n                </select>\r\n            </div>\r\n            <div id="FavLineNext" class="FavButton"></div>\r\n        </div>\r\n    </div>\r\n    <table id="FavLineBody" class="talklist_main" cellpadding="0" cellspacing="0" width="100%">\r\n    <tbody><tr>\r\n    <td id="FavLeftLine" class="tleft"></td>\r\n    <td id="FavRightLine" class="tright"></td>\r\n    </tr></tbody></table>\r\n</div>\r\n'},function(t,e,n){var r=n(4);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(6)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){(t.exports=n(5)(!1)).push([t.i,'@charset "utf-8";\r\n\r\n#FavLineNav > * {\r\n    margin-bottom: 10px;\r\n}\r\n\r\n#FavControl {\r\n    height: 30px;\r\n    max-height: 30px;\r\n    display: flex;\r\n    align-content: center;\r\n    justify-content: flex-end;\r\n    margin-left: 300px;\r\n    padding: 2px 0px;\r\n    align-items: center;\r\n    background: linear-gradient(90deg, transparent, rgba(255, 64, 64, 0.3));\r\n    border-right: 8px solid rgba(255, 64, 64, 0.35);\r\n}\r\n\r\n#FavControlMessage {\r\n    display: none;\r\n    line-height: 25px;\r\n    background-color: white;\r\n    border-radius: 5px;\r\n    z-index: 100;\r\n    text-align: center;\r\n    color: #CC6600;\r\n    font-size: 15px;\r\n    font-weight: bold;\r\n    margin: 0px 5px;\r\n    padding: 2px;\r\n}\r\n\r\n.FavButton {\r\n    margin: 0 2px;\r\n    padding: 3px;\r\n    padding-left: 12px;\r\n    padding-right: 12px;\r\n    border: 1px #997722 solid;\r\n    border-radius: 3px;\r\n    background-color: #ffdd66;\r\n    color: #774400;\r\n    font-weight: bold;\r\n    -webkit-appearance: none;\r\n}\r\n.FavButton:hover{\r\n    background-color: #ffee88;\r\n}\r\n.FavBut1 {\r\n\r\n}\r\n.FavBut2 {\r\n\r\n}\r\n.FavBut3 {\r\n\r\n}\r\n\r\n#FavSearchBar {\r\n    display: flex;\r\n    align-content: center;\r\n    justify-content: space-between;\r\n    padding: 2px;\r\n    align-items: center;\r\n}\r\n\r\n#FavLinePrev, #FavLineNext {\r\n    display: inline-block;\r\n    width: 160px;\r\n    text-align: center;\r\n}\r\n\r\n#FavSearch {\r\n    width: 440px;\r\n    text-align: center;\r\n}\r\n\r\n#FavSearch > input {\r\n    width: 300px;\r\n}\r\n\r\n.ShowFavsBtn > span {\r\n    position: relative;\r\n    background-color: #ffdddd;\r\n    border-left-color: #ffbbbb;\r\n}\r\n.ShowFavsBtn.Shown > span {\r\n    font-weight: bold;\r\n}\r\n.ShowFavsBtn.Shown > span:after {\r\n    content: "";\r\n    position: absolute;\r\n    right: 0;\r\n    display: block;\r\n    width: 0px;\r\n    height: 0px;\r\n    bottom: 0;\r\n    border-right: solid 20px #ffbbbb;\r\n    border-top: solid 14px white;\r\n}\r\n\r\n.FavChat {\r\n    display: inline-block;\r\n    position: absolute;\r\n    color: #BBBBBB;\r\n    left: 0;\r\n    cursor: pointer;\r\n}\r\n.FavChat:before {\r\n    content: "\\2665";\r\n    display: inline-block;\r\n    position: relative;\r\n    top: 3px;\r\n    font-size: 20px;\r\n    font-family: "Segoe UI Symbol", sans-serif;\r\n}\r\n.FavChat:hover,.FavChat.Favd:hover {\r\n    color: #FF6666;\r\n}\r\n.FavChat.Favd {\r\n    color: #EE5555;\r\n}\r\n\r\n.talkarea.talkmain > div:last-child {\r\n    position: relative;\r\n}',""])},function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=(o=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),s=r.sources.map((function(t){return"/*# sourceURL="+r.sourceRoot+t+" */"}));return[n].concat(s).concat([i]).join("\n")}var o;return[n].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+n+"}":n})).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},i=0;i<this.length;i++){var s=this[i][0];null!=s&&(r[s]=!0)}for(i=0;i<t.length;i++){var o=t[i];null!=o[0]&&r[o[0]]||(n&&!o[2]?o[2]=n:n&&(o[2]="("+o[2]+") and ("+n+")"),e.push(o))}},e}},function(t,e,n){var r,i,s={},o=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===i&&(i=r.apply(this,arguments)),i}),a=function(t,e){return e?e.querySelector(t):document.querySelector(t)},l=function(t){var e={};return function(t,n){if("function"==typeof t)return t();if(void 0===e[t]){var r=a.call(this,t,n);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(t){r=null}e[t]=r}return e[t]}}(),d=null,c=0,h=[],u=n(7);function f(t,e){for(var n=0;n<t.length;n++){var r=t[n],i=s[r.id];if(i){i.refs++;for(var o=0;o<i.parts.length;o++)i.parts[o](r.parts[o]);for(;o<r.parts.length;o++)i.parts.push(y(r.parts[o],e))}else{var a=[];for(o=0;o<r.parts.length;o++)a.push(y(r.parts[o],e));s[r.id]={id:r.id,refs:1,parts:a}}}}function v(t,e){for(var n=[],r={},i=0;i<t.length;i++){var s=t[i],o=e.base?s[0]+e.base:s[0],a={css:s[1],media:s[2],sourceMap:s[3]};r[o]?r[o].parts.push(a):n.push(r[o]={id:o,parts:[a]})}return n}function m(t,e){var n=l(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=h[h.length-1];if("top"===t.insertAt)r?r.nextSibling?n.insertBefore(e,r.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),h.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=l(t.insertAt.before,n);n.insertBefore(e,i)}}function p(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=h.indexOf(t);e>=0&&h.splice(e,1)}function b(t){var e=document.createElement("style");if(void 0===t.attrs.type&&(t.attrs.type="text/css"),void 0===t.attrs.nonce){var r=function(){0;return n.nc}();r&&(t.attrs.nonce=r)}return F(e,t.attrs),m(t,e),e}function F(t,e){Object.keys(e).forEach((function(n){t.setAttribute(n,e[n])}))}function y(t,e){var n,r,i,s;if(e.transform&&t.css){if(!(s="function"==typeof e.transform?e.transform(t.css):e.transform.default(t.css)))return function(){};t.css=s}if(e.singleton){var o=c++;n=d||(d=b(e)),r=S.bind(null,n,o,!1),i=S.bind(null,n,o,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",F(e,t.attrs),m(t,e),e}(e),r=A.bind(null,n,e),i=function(){p(n),n.href&&URL.revokeObjectURL(n.href)}):(n=b(e),r=N.bind(null,n),i=function(){p(n)});return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else i()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=o()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=v(t,e);return f(n,e),function(t){for(var r=[],i=0;i<n.length;i++){var o=n[i];(a=s[o.id]).refs--,r.push(a)}t&&f(v(t,e),e);for(i=0;i<r.length;i++){var a;if(0===(a=r[i]).refs){for(var l=0;l<a.parts.length;l++)a.parts[l]();delete s[a.id]}}}};var w,g=(w=[],function(t,e){return w[t]=e,w.filter(Boolean).join("\n")});function S(t,e,n,r){var i=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=g(e,i);else{var s=document.createTextNode(i),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(s,o[e]):t.appendChild(s)}}function N(t,e){var n=e.css,r=e.media;if(r&&t.setAttribute("media",r),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function A(t,e,n){var r=n.css,i=n.sourceMap,s=void 0===e.convertToAbsoluteUrls&&i;(e.convertToAbsoluteUrls||s)&&(r=u(r)),i&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var o=new Blob([r],{type:"text/css"}),a=t.href;t.href=URL.createObjectURL(o),a&&URL.revokeObjectURL(a)}},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,r=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(t,e){var i,s=e.trim().replace(/^"(.*)"$/,(function(t,e){return e})).replace(/^'(.*)'$/,(function(t,e){return e}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(s)?t:(i=0===s.indexOf("//")?s:0===s.indexOf("/")?n+s:r+s.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")}))}},function(t,e,n){"use strict";n.r(e);var r={scriptName:"SGFavChat",dbName:"SGTools_FavChat",dbVersion:1},i=function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}l((r=r.apply(t,e||[])).next())}))};class s{constructor(t,e){if(this.db=null,"name"in t)this.db=t,this.dbPromise=Promise.resolve(this.db),this.dbName=this.db.name,this.tableName=e,this.dbVersion=this.db.version;else{this.dbName=t.dbName,this.tableName=t.tableName,this.dbVersion=t.dbVersion,t.objectStoreParameters&&(this.objectStoreParameters=Object.freeze(Object.assign({},t.objectStoreParameters)))}}get DBPromise(){return this.dbPromise}get DBIsOpen(){return!!this.db}open(t){const e=indexedDB.open(this.dbName,this.dbVersion);return this.dbPromise=new Promise((n,r)=>{const i=this;e.onsuccess=function(t){i.db=this.result,n(i.db)},e.onerror=function(t){i.db=null,r("db error")},e.onupgradeneeded=function(e){const n=this.result;if(n.objectStoreNames.contains(i.tableName))t&&t(n,e);else{n.createObjectStore(i.tableName,i.objectStoreParameters)}n.onversionchange=t=>{n.close(),alert("データベースが更新されました。ページを再読込してください。")}},e.onblocked=function(t){r("blocked: db is already open.")}})}close(){var t;null===(t=this.db)||void 0===t||t.close()}count(t){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readonly").objectStore(this.tableName).count(t);return new Promise((t,n)=>{e.onsuccess=function(e){t(this.result)},e.onerror=function(t){n("db error")}})}get(t){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readonly").objectStore(this.tableName).get(t);return new Promise((t,n)=>{e.onsuccess=function(e){t(this.result)},e.onerror=function(t){n("db error")}})}getAll(t,e){if(!this.db)throw this.throwDBIsNotReadyError();const n=this.db.transaction(this.tableName,"readonly").objectStore(this.tableName).getAll(t,e);return new Promise((t,e)=>{n.onsuccess=function(e){t(this.result)},n.onerror=function(t){e("db error")}})}getAllDescending(t,e){return i(this,void 0,void 0,(function*(){const n=[];if(void 0===e)return yield this.iterate(t=>(n.push(t),!1),t,"prev"),n;let r=e;return r<=0?n:(yield this.iterate(t=>(n.push(t),0==--r),t,"prev"),n)}))}getKey(t){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readonly").objectStore(this.tableName).getKey(t);return new Promise((t,n)=>{e.onsuccess=function(e){t(this.result)},e.onerror=function(t){n("db error")}})}getAllKeys(t,e){if(!this.db)throw this.throwDBIsNotReadyError();const n=this.db.transaction(this.tableName,"readonly").objectStore(this.tableName).getAllKeys(t,e);return new Promise((t,e)=>{n.onsuccess=function(e){t(this.result)},n.onerror=function(t){e("db error")}})}add(t,e){if(!this.db)throw this.throwDBIsNotReadyError();const n=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return this._add(n,t,e)}bulkAdd(t){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return this._addMany(e,t)}put(t,e){if(!this.db)throw this.throwDBIsNotReadyError();const n=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return this._put(n,t,e)}bulkPut(t){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return this._putMany(e,t)}delete(t){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return this._delete(e,t)}bulkDelete(t){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return this._deleteMany(e,t)}clear(){if(!this.db)throw this.throwDBIsNotReadyError();const t=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return this._clear(t)}replaceAll(t){return i(this,void 0,void 0,(function*(){if(!this.db)throw this.throwDBIsNotReadyError();const e=this.db.transaction(this.tableName,"readwrite").objectStore(this.tableName);return yield this._clear(e),yield this._addMany(e,t)}))}openCursor(t,e,n){if(!this.db)throw this.throwDBIsNotReadyError();return this.db.transaction(this.tableName,n).objectStore(this.tableName).openCursor(t,e)}openKeyCursor(t,e,n){if(!this.db)throw this.throwDBIsNotReadyError();return this.db.transaction(this.tableName,n).objectStore(this.tableName).openKeyCursor(t,e)}iterate(t,e,n,r){const i=this.openCursor(e,n,r);return new Promise((e,n)=>{i.onsuccess=function(n){const r=this.result;r?t(r.value,r)?e():r.continue():e()},i.onerror=function(t){n("db error")}})}iterateKey(t,e,n,r){const i=this.openKeyCursor(e,n,r);return new Promise((e,n)=>{i.onsuccess=function(n){const r=this.result;r?t(r.key,r)?e():r.continue():e()},i.onerror=function(t){n("db error")}})}_clear(t){const e=t.clear();return new Promise((t,n)=>{e.onsuccess=function(e){t()},e.onerror=function(t){n("db error")}})}_add(t,e,n){const r=t.add(e,n);return new Promise((t,e)=>{r.onsuccess=function(e){t(this.result)},r.onerror=function(t){e("db error")}})}_addMany(t,e){return i(this,void 0,void 0,(function*(){if(0===e.length)return[];const n=[];if(Array.isArray(e[0]))for(const r of e)n.push(yield this._add(t,r[1],r[0]));else for(const r of e)n.push(yield this._add(t,r));return n}))}_put(t,e,n){const r=t.put(e,n);return new Promise((t,e)=>{r.onsuccess=function(e){t(this.result)},r.onerror=function(t){e("db error")}})}_putMany(t,e){return i(this,void 0,void 0,(function*(){if(0===e.length)return[];const n=[];if(Array.isArray(e[0]))for(const r of e)n.push(yield this._put(t,r[1],r[0]));else for(const r of e)n.push(yield this._put(t,r));return n}))}_delete(t,e){if(!this.db)throw this.throwDBIsNotReadyError();const n=t.delete(e);return new Promise((t,e)=>{n.onsuccess=function(e){t()},n.onerror=function(t){e("db error")}})}_deleteMany(t,e){return i(this,void 0,void 0,(function*(){if(0!==e.length)for(const n of e)yield this._delete(t,n)}))}throwDBIsNotReadyError(){throw new Error("DBの準備が完了していません。Promiseを参照してDBが開けるまで待機してください。")}}const o=/^(\d+)$/,a=/\s?eno\s*(?:\:|.)\s*(\d+)/i;class l{constructor(t){this.id=t.id,this.eno=t.eno,this.treeId=t.treeId,this.isSecret=t.isSecret,this.bodyHtml=t.bodyHtml,this.timeinfoHtml=t.timeinfoHtml}static matchFavItem(t,e){if(!t)return!0;if(o.exec(t))return parseInt(t,10)===e.eno;const n=a.exec(t);if(n){const r=n[1];if(!(parseInt(r,10)===e.eno))return!1;t=t.split(n[0]).join("")}const r=t.trim().toLowerCase();return-1!==e.bodyHtml.toLowerCase().indexOf(r)||-1!==e.timeinfoHtml.toLowerCase().indexOf(r)}static getFavSearchQueryString(t){const e=[];return t.word&&e.push(t.word),"number"==typeof t.eno&&e.push("eno:"+t.eno),e.join(" ")}static isSane(t){let e=null;return e="number"==typeof t.id?e:"id",e="number"==typeof t.eno?e:"eno",e="number"==typeof t.treeId?e:"treeId",e=t.bodyHtml||""===t.bodyHtml?e:"bodyHtml",e=t.timeinfoHtml||""===t.timeinfoHtml?e:"timeinfoHtml",!e}}var d=function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}l((r=r.apply(t,e||[])).next())}))};class c{constructor(t){t?this.table=new s(t,c.TABLE_NAME):(this.table=new s({dbName:r.scriptName,dbVersion:r.dbVersion,tableName:c.TABLE_NAME,objectStoreParameters:c.TABLE_INITIALIZER}),this.table.open())}get DBPromise(){return new Promise((t,e)=>{this.table.DBPromise.then(()=>t(),t=>e(t))})}get DBIsOpen(){return this.table.DBIsOpen}put(t){return this.table.put(t)}delete(t){return this.table.delete(t)}count(){return this.table.count()}getAll(){return this.table.getAll()}bulkAdd(t){return this.table.bulkAdd(t)}bulkPut(t){return this.table.bulkPut(t)}bulkDelete(t){return this.table.bulkDelete(t)}clear(){return this.table.clear()}replaceAll(t){return this.table.replaceAll(t)}contains(t){return d(this,void 0,void 0,(function*(){let e=!1;return yield this.table.iterateKey(t=>(e=!0,!0),t,"prev"),e}))}intersect(t){return d(this,void 0,void 0,(function*(){if(0===t.length)return[];const e=t.slice().sort((t,e)=>e-t);let n=e.shift();const r=[];return yield this.table.iterateKey(t=>{for(;n>=t;){if(n===t&&r.push(n),0===e.length)return!0;n=e.shift()}return!1},null,"prev"),r}))}search(t,e=null,n,r,i){return d(this,void 0,void 0,(function*(){const s=[];let o=null;if("number"==typeof e&&(o=i&&i.startsWith("prev")?IDBKeyRange.upperBound(e,!!n):i&&i.startsWith("next")?IDBKeyRange.lowerBound(e,!!n):e),"number"!=typeof r)yield this.table.iterate(e=>{l.matchFavItem(t,e)&&s.push(e)},o,i);else{if(r<=0)return[];let e=r;yield this.table.iterate(n=>{if(l.matchFavItem(t,n)&&(s.push(n),0==--e))return!0},o,i)}return s}))}}c.TABLE_NAME="FavData",c.TABLE_INITIALIZER=Object.freeze({autoIncrement:!1,keyPath:"id"});class h{constructor(){this.id=0,this.prevResolve=null}setDelay(t,e,...n){return new Promise((r,i)=>{this.id&&this.prevResolve&&(clearTimeout(this.id),this.prevResolve(null)),this.id=setTimeout(e=>{this.id=0,this.prevResolve=null,r(t.apply(null,e))},e,n),this.prevResolve=r})}static delay(t){return new Promise(e=>{setTimeout(()=>e(),t)})}}function u(t,e,n){let r,i=void 0;n?(r=n,i=e):r=e;const s=function(t,...e){return"touchstart"===t.type&&t.preventDefault(),r.apply(this,[t,...e])};return t.on({click:s,ontouchstart:s},i)}var f=function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}l((r=r.apply(t,e||[])).next())}))};var v=function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}l((r=r.apply(t,e||[])).next())}))};var m=function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}l((r=r.apply(t,e||[])).next())}))};class p extends class extends class{constructor(t="text/plain"){this.mime=t,this.$dlAnchor=$("<a></a>").css("display","none").appendTo(document.body),this.onExport=null,this.$dlInput=this.initDlInput()}enable(t,e){u($(t),()=>this.export()),u($(e),()=>this.$dlInput.click())}initDlInput(){const t=this;return $("<input type='file'>").attr("accept",this.mime).css("display","none").appendTo(document.body).on("change",(function(){return f(this,void 0,void 0,(function*(){const e=this.files;e&&0!==e.length&&(yield t.import(e[0]),this.value="")}))}))}export(){return f(this,void 0,void 0,(function*(){if(this.onExport&&(yield this.onExport()))return;const t=yield this.buildContentToExport(),e=this.buildFileName(t),n=new Blob([t],{type:this.mime}),r=new File([n],e),i=this.$dlAnchor[0];i.href=URL.createObjectURL(r),i.download=e,i.click()}))}import(t){return f(this,void 0,void 0,(function*(){const e=yield this.selectContent(yield new Response(t));yield this.afterImported(e)}))}}{constructor(t,e){super("application/json"),this.jsonReplacer=t,this.jsonSpace=e}buildContentToExport(){return v(this,void 0,void 0,(function*(){const t=yield this.selectObject();return this.nextFileName=this.buildJSONFileName(t),JSON.stringify(t,this.jsonReplacer,this.jsonSpace)}))}buildFileName(t){return this.nextFileName}selectContent(t){return v(this,void 0,void 0,(function*(){return yield t.text()}))}afterImported(t){this.afterImportedObject(JSON.parse(t))}}{constructor(t){super(),this.db=t,this.messenger=alert,this.afterImportedFavs=null,this.afterImportedObject=t=>this.validateThenStoreFavs(t)}selectObject(){return m(this,void 0,void 0,(function*(){return yield this.db.getAll()}))}buildJSONFileName(t){const e=(n=new Date(Date.now())).getFullYear().toString().slice(-2)+("0"+n.getDate()).slice(-2)+("0"+n.getHours()).slice(-2)+("0"+n.getMinutes()).slice(-2)+("0"+n.getSeconds()).slice(-2);var n;return p.FILE_NAME_PREFIX+e+p.FILE_NAME_SUFFIX}afterImportedObject(t){return this.validateThenStoreFavs(t)}validateThenStoreFavs(t){return m(this,void 0,void 0,(function*(){const e=[];for(const n of t)l.isSane(n)?e.push(n):this.throwInvalidFileImportedError("insane item: "+JSON.stringify(n));let n;0===(yield this.db.count())?(n=yield this.db.bulkAdd(e),this.messenger("入力完了！")):(n=yield this.db.bulkPut(e),this.messenger("追加完了！")),this.afterImportedFavs&&(yield this.afterImportedFavs(n))}))}throwInvalidFileImportedError(t){throw alert("お気に入り情報の復元に失敗しました。入力されたファイルの形式が不正です。"),new Error("InvalidFileImportedError\ninfo: "+t)}}p.FILE_NAME_PREFIX=r.scriptName+"_FavData",p.FILE_NAME_SUFFIX=".json";var b=n(0),F=n.n(b),y=n(1),w=n.n(y),g=n(2),S=n.n(g),N=(n(3),function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}l((r=r.apply(t,e||[])).next())}))});class A{constructor(t){this.searchDelayer=new h,this.searchingPromise=null,this.currentFavItems=null,this.maxShownFavsCount=A.initialShownFavsCount,this.$parentContainer=$(".mainarea > .sheet > .talkarea"),this.$frame=null,this.$regularLineElements=$(".talklist_main"),this.$showFavsBtn=$(`<a class="${A.CLASSNAME_SHOW_FAVS_BUTTON}" onclick="return false;"><span class="roomname">お気に入り</span></a>`),this.$favTimeLineOrdering=null,this.db=new c(t),this.io=new p(this.db),this.io.messenger=A.showControlMessage}enable(t){return N(this,void 0,void 0,(function*(){yield this.db.DBPromise,yield this.addFavButtons(t);const e=this;u($(t),"."+A.CLASSNAME_FAV_BUTTON,(function(t){e.toggleFav(this)})),this.$showFavsBtn.insertAfter('a[href="./?mode=chat&list=4"]:first'),u(this.$showFavsBtn,()=>this.toggleFavTimeLine())}))}toggleFav(t){return N(this,void 0,void 0,(function*(){t.classList.contains(A.CLASSNAME_FAV_BUTTON_FAVD)?yield this.removeFav(t):yield this.addFav(t)}))}addFav(t){const e=this.extractIdFromFavButton(t);this.activateFavButtonsOnChat(e),t.classList.add(A.CLASSNAME_FAV_BUTTON_FAVD);const n=this.takeOrBuildFavItem(t);return this.db.put(n)}removeFav(t){const e=this.extractIdFromFavButton(t);return this.deactivateFavButtonsOnChat(e),t.classList.remove(A.CLASSNAME_FAV_BUTTON_FAVD),this.db.delete(e)}addAllFavOfVisible(){const t=this.$queryAllVisibleFavButtons("non-favd").get(),e=[];for(const n of t){const t=this.extractIdFromFavButton(n);this.activateFavButtonsOnChat(t),n.classList.add(A.CLASSNAME_FAV_BUTTON_FAVD),e.push(this.takeOrBuildFavItem(n))}return 0===e.length?Promise.resolve([]):this.db.bulkPut(e)}removeAllFavOfVisible(){const t=this.$queryAllVisibleFavButtons("favd").get().map(t=>{const e=this.extractIdFromFavButton(t);return this.deactivateFavButtonsOnChat(e),t.classList.remove(A.CLASSNAME_FAV_BUTTON_FAVD),e});return 0===t.length?Promise.resolve():this.db.bulkDelete(t)}$findFavButtonsOnChatWithTheSameId(t){if(!this.$frame||!this.favTimeLineIsVisible())return null;let e;e="number"==typeof t?[t]:t;const n=this;return this.$regularLineElements.find("."+A.CLASSNAME_FAV_BUTTON).filter((function(){const t=n.extractIdFromFavButton(this);return-1!==e.findIndex(e=>e===t)}))}activateFavButtonsOnChat(t){let e;e=void 0===t?$("."+A.CLASSNAME_FAV_BUTTON):this.$findFavButtonsOnChatWithTheSameId(t),e&&e.addClass(A.CLASSNAME_FAV_BUTTON_FAVD)}deactivateFavButtonsOnChat(t){let e;e=void 0===t?$("."+A.CLASSNAME_FAV_BUTTON):this.$findFavButtonsOnChatWithTheSameId(t),e&&e.removeClass(A.CLASSNAME_FAV_BUTTON_FAVD)}addFavButtons(t,e=!1){return N(this,void 0,void 0,(function*(){const n=$(t).find(".res"),r=n.get().map(t=>{var e;return parseInt(null!=(e=t.getAttribute("restid"))?e:t.dataset.restid,10)});let i=null;return e||(i=new Set(yield this.db.intersect(r))),n.map((t,n)=>{const s=$(`<span class="${A.CLASSNAME_FAV_BUTTON}"></span>`).insertBefore($(n).parent());return s[0].dataset[A.DATANAME_FAV_BUTTON_ID]=r[t].toString(),(e||i.has(r[t]))&&s.addClass(A.CLASSNAME_FAV_BUTTON_FAVD),s[0]})}))}extractIdFromFavButton(t){if("string"!=typeof t.dataset[A.DATANAME_FAV_BUTTON_ID])throw new Error("invalid operation");return parseInt(t.dataset[A.DATANAME_FAV_BUTTON_ID],10)}takeOrBuildFavItem(t){const e=this.extractIdFromFavButton(t);if(this.currentFavItems){const t=this.currentFavItems.find(t=>t.id===e);if(t)return t}return this._buildFavItem(t)}_buildFavItem(t){const e=this.extractIdFromFavButton(t),n=$(t).next().children(".times"),r=n.siblings(".res"),i=parseInt(r.attr("reseno"),10),s="1"===r.attr("hiddenmessage"),o=n.closest("div").prev(),a=o.children("div:last-child").children("small:first-child").children("a");let d=e;return a.length>0&&(d=parseInt((/\d+$/.exec(a.attr("href"))||["0"])[0],10)),new l({id:e,eno:i,treeId:d,isSecret:s,bodyHtml:o.html(),timeinfoHtml:n.html()})}$queryAllVisibleFavButtons(t="all"){let e;return e=this.favTimeLineIsVisible()?this.$frame.find("."+A.CLASSNAME_FAV_BUTTON):this.$regularLineElements.find("."+A.CLASSNAME_FAV_BUTTON),"favd"===t?e=e.filter("."+A.CLASSNAME_FAV_BUTTON_FAVD):"non-favd"===t&&(e=e.not("."+A.CLASSNAME_FAV_BUTTON_FAVD)),e}favTimeLineIsVisible(){return!!this.$frame&&"none"!==this.$frame.css("display")}toggleFavTimeLine(){return N(this,void 0,void 0,(function*(){if(this.favTimeLineIsVisible())return this.$showFavsBtn.removeClass(A.CLASSNAME_SHOWN),this.$frame.fadeOut(A.animationFadeMS),this.$regularLineElements.fadeIn(A.animationFadeMS),void(this.currentFavItems=null);this.maxShownFavsCount<=0||(this.$frame||(this.$frame=this.initFavTimeLine().hide(),this.$frame.prependTo(this.$parentContainer)),(yield this.showFirstTimeLine())&&(this.$showFavsBtn.addClass(A.CLASSNAME_SHOWN),this.$frame.show(),this.$regularLineElements.fadeOut(A.animationFadeMS)))}))}initFavTimeLine(){const t=$(S.a);this.$favTimeLineOrdering=t.find("#FavSearch > select").val(this.checkIfOrderingIsAscending()?"1":"0"),this.$frame=t;return u(t.find("#FavLinePrev").text(`<<前の${this.maxShownFavsCount}件を表示`),()=>N(this,void 0,void 0,(function*(){yield this.showPrevTimeLine()}))),u(t.find("#FavLineNext").text(`次の${this.maxShownFavsCount}件を表示>>`),()=>N(this,void 0,void 0,(function*(){yield this.showNextTimeLine()}))),this.enableSearch(),this.io.enable(t.find("#ExportFavs")[0],t.find("#ImportFavs")[0]),this.io.afterImportedFavs=t=>N(this,void 0,void 0,(function*(){this.deactivateFavButtonsOnChat(),this.activateFavButtonsOnChat(t),yield this.showFirstTimeLine()})),u(t.find("#DeleteFavs"),()=>this.deleteFavs()),t}showFirstTimeLine(){return N(this,void 0,void 0,(function*(){const t=yield this._searchFirst();return!!t&&(yield this.overwriteFavItemsOnFavTimeLine(t),!0)}))}showNextTimeLine(){return N(this,void 0,void 0,(function*(){if(!this.currentFavItems)throw new Error("invalid operation");if(this.currentFavItems.length<this.maxShownFavsCount)return!1;const t=yield this._searchNext();return!(!t||0===t.length)&&(yield this.overwriteFavItemsOnFavTimeLine(t),!0)}))}showPrevTimeLine(){return N(this,void 0,void 0,(function*(){if(!this.currentFavItems)throw new Error("invalid operation");if(0===this.currentFavItems.length)return!1;let t=yield this._searchPrev();if(!t||0===t.length)return!1;if(t.length<this.maxShownFavsCount){const e=this.currentFavItems.slice().sort((t,e)=>t.id-e.id);let n;n=this.checkIfOrderingIsAscending()?e.slice(0,this.maxShownFavsCount-t.length):e.reverse().slice(0,this.maxShownFavsCount-t.length),t=t.concat(n)}return yield this.overwriteFavItemsOnFavTimeLine(t),!0}))}overwriteFavItemsOnFavTimeLine(t){return N(this,void 0,void 0,(function*(){if(!this.$frame)throw new Error("invalid operation");this.currentFavItems=t;const e=t.map(this.formatFav),n=Math.ceil(this.maxShownFavsCount/2),r=[$(document.createDocumentFragment()),$(document.createDocumentFragment())];for(let t=0;t<e.length;++t)t<n?r[0].append(e[t]):r[1].append(e[t]);const i=this.$frame.find("#FavLeftLine"),s=this.$frame.find("#FavRightLine"),o=i.children(),a=s.children(),l=this.$frame.find("#FavLineBody");yield new Promise(t=>{l.fadeOut(A.animationFadeMS/2,()=>{i.prepend(r[0]),s.prepend(r[1]),o.remove(),a.remove(),t()})}),l.fadeIn(A.animationFadeMS/2),yield this.addFavButtons(this.$frame[0],!0)}))}enableSearch(){return N(this,void 0,void 0,(function*(){if(!this.$frame||!this.$favTimeLineOrdering)throw new Error("invalid operation");const t=this.$frame.find("#FavSearch > input");t.on("focus",(function(){this.setSelectionRange(0,this.value.length)})),t.on("input",t=>N(this,void 0,void 0,(function*(){13===t.keyCode?(t.preventDefault(),yield this.showFirstTimeLine()):this.searchDelayer.setDelay(()=>N(this,void 0,void 0,(function*(){yield this.showFirstTimeLine()})),A.searchDelayMS)}))),this.$favTimeLineOrdering.on("change",()=>N(this,void 0,void 0,(function*(){yield this.showFirstTimeLine()})))}))}_search(t,e,n,r){return N(this,void 0,void 0,(function*(){if(!this.$frame)throw new Error("invalid operation");const i=this.searchingPromise;return this.searchingPromise=(()=>N(this,void 0,void 0,(function*(){const s=this.getSearchWordValue();if(i&&(yield i),this.getSearchWordValue()!==s)return null;const o=yield this.db.search(s,t,e,n,r);return this.searchingPromise=null,o})))()}))}_searchNext(){return N(this,void 0,void 0,(function*(){if(!this.currentFavItems)throw new Error("invalid operation");if(this.currentFavItems.length<this.maxShownFavsCount)return null;const t=this.currentFavItems.map(t=>t.id);let e;return e=this.checkIfOrderingIsAscending()?yield this._search(Math.max(...t),!0,this.maxShownFavsCount,"next"):yield this._search(Math.min(...t),!0,this.maxShownFavsCount,"prev"),e}))}_searchPrev(){return N(this,void 0,void 0,(function*(){if(!this.currentFavItems)throw new Error("invalid operation");if(0===this.currentFavItems.length)return null;const t=this.currentFavItems.map(t=>t.id);let e;return e=this.checkIfOrderingIsAscending()?yield this._search(Math.min(...t),!0,this.maxShownFavsCount,"prev"):yield this._search(Math.max(...t),!0,this.maxShownFavsCount,"next"),null===e?null:e.reverse()}))}_searchFirst(){return N(this,void 0,void 0,(function*(){let t;return t=this.checkIfOrderingIsAscending()?yield this._search(null,null,this.maxShownFavsCount,"next"):yield this._search(null,null,this.maxShownFavsCount,"prev"),t}))}getSearchWordValue(){return this.$frame&&"none"!==this.$frame.css("display")?this.$frame.find("#FavSearch > input").val():""}checkIfOrderingIsAscending(){return this.$frame?"1"===this.$frame.find("#FavSearch > select").val():A.initiallyOrderedByAscending}deleteFavs(){return N(this,void 0,void 0,(function*(){confirm("お気に入り発言データをすべて消去してもよろしいですか？")&&(yield this.db.clear(),A.showControlMessage("消去完了。"),this.deactivateFavButtonsOnChat(),yield this.showFirstTimeLine())}))}formatFav(t){let e="markerC2",n="",r=3;return t.isSecret&&(e="markerB2",n=w.a,r=7),function(t,e){let n=t.toString();for(const t in e)void 0!==e[t]&&null!==e[t]&&(n=n.replace(new RegExp("{"+t+"}","g"),e[t].toString()));return n}(F.a,{ID:t.id,ENO:t.eno,TREE_ID:t.treeId,BODY_CLASS_NAME:e,LOCK_HTML:n,BODY_HTML:t.bodyHtml,CHATLIST_INDEX:r,TIMEINFO_HTML:t.timeinfoHtml})}static selectFrame(){const t=$("#FavLine");return 0===t.length?null:t}static showControlMessage(t){const e=A.selectFrame();if(!e)throw new Error("invalid operation");const n=e.find("#FavControlMessage").text(null!=t?t:"").hide();return new Promise(t=>{n.fadeIn(A.animationFadeMS,()=>N(this,void 0,void 0,(function*(){yield h.delay(A.messageDurationMS),n.fadeOut(A.animationFadeMS,()=>{t()})})))})}}A.CLASSNAME_FAV_BUTTON="FavChat",A.CLASSNAME_FAV_BUTTON_FAVD="Favd",A.CLASSNAME_SHOW_FAVS_BUTTON="ShowFavsBtn",A.CLASSNAME_SHOWN="Shown",A.DEFAULT_SHOWN_FAVS=10,A.animationFadeMS=200,A.searchDelayMS=200,A.messageDurationMS=2e3,A.initialShownFavsCount=parseInt((/\d+/.exec($(".pager").text())||[A.DEFAULT_SHOWN_FAVS.toString()])[0],10),A.DATANAME_FAV_BUTTON_ID="restid",A.initiallyOrderedByAscending=!1;class I{constructor(t,e){this.dbName=t,this.dbVersion=e,this.dbTableNames=new Set,this.initializers=new Map,this.migrationListners=new Map,this.dbIsInitialized=!1}get DBIsInitialized(){return this.dbIsInitialized}get DBPromise(){return this.dbPromise?this.dbPromise:Promise.reject("db has not been tried to open.")}addTable(t,e,n){if(this.dbTableNames.has(t))throw new Error("this tableName "+t+" has already been added.");this.dbTableNames.add(t),this.initializers.set(t,e),n&&this.migrationListners.set(t,n)}initThenOpen(){return this.dbPromise=new Promise((t,e)=>{const n=indexedDB.open(this.dbName,this.dbVersion);this.dbIsInitialized=!0,n.onsuccess=function(e){t(this.result)},n.onerror=function(t){e("failed to open talkutil db")},n.onupgradeneeded=t=>{const e=n.result;this.dbTableNames.forEach(n=>{const r=this.migrationListners.get(n);e.objectStoreNames.contains(n)?r&&r(e,t):e.createObjectStore(n,this.initializers.get(n))}),e.onversionchange=t=>{e.close(),alert("データベースが更新されました。ページを再読込してください。")}},n.onblocked=function(t){e("blocked: db is already open.")}})}}(function(t,e,n,r){new(n||(n=Promise))((function(i,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}l((r=r.apply(t,e||[])).next())}))})(void 0,void 0,void 0,(function*(){if(0===document.getElementsByClassName("talkarea").length)return;const t=new I(r.dbName,r.dbVersion);t.addTable(c.TABLE_NAME,c.TABLE_INITIALIZER);const e=yield t.initThenOpen();new A(e).enable(document.body)}))}]);