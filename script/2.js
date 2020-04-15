// ==UserScript==
// @name         发票抓取-登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Reeye
// @match        https://fpdk.jiangsu.chinatax.gov.cn:81/sigin*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var W = window;
    W.pwd = '12345678';
    W.ptpwd = 'wy790124';

    W.funcLogin = function() {
        Log('进行登录');
        $('#password').val(pwd);
        $('#submit').click();
        Sto(() => {
            if (location.href.indexOf('sigin') > 0) {
                $('#password').val(pwd);
                $('#password3').val(ptpwd);
                $('#submit').click();
            }
        }, 3000);
    }
    Sto(W.funcLogin, 3000);
})();