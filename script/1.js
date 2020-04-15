// ==UserScript==
// @name         发票-before
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Reeye
// @match        https://fpdk.jiangsu.chinatax.gov.cn:81/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.Log = console.log;
    window.Sto = setTimeout;
    window.Siv = setInterval;
    window.onload = () => {
        var layerScript = document.createElement("script");
        layerScript.setAttribute('type', 'text/javascript');
        layerScript.setAttribute('src', 'https://reeye.cn/layer/layer.js');
        document.body.appendChild(layerScript)
    }
})();