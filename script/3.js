// ==UserScript==
// @name         发票抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Reeye
// @match        https://fpdk.jiangsu.chinatax.gov.cn:81/main*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var W = window;
    W.ck = {};

    W.sendData = function(nsrmc, data) {
        Log('发送数据');
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/fpdk/batchSave?nsrmc=' + nsrmc,
            contentType: 'application/json',
            timeout : 3600000, // one hour
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(res) {
                Log('发送成功:' + res.saveCount);
                if (res.xfshs && res.xfshs.length > 0) {
                    Log('获取详情数据,共需次数: ' + res.xfshs.length);
                    var index = { no: 0 };
                    var cert = W.ck.token.replace(/(^.*?@@)|(@@.*?$)/g, '');
                    var token = unescape(W.ck.token);
                    var timer = Siv(() => {
                        if (index.no >= res.xfshs.length) {
                        clearInterval(timer);
                        Log('获取详情数据完毕');
                    }
                    W.funcFpdkExtra(cert, token, res.xfshs[index.no++]);
                }, 1000)
                } else {
                    Log('发送完毕');
                }
            },
            error: function(data,type, err) {
                Log('发送失败:' + err.message);
            }
        });
    }

    W.sendExtraData = function(nsrsbh, djzt, sfztslqy, xfsh) {
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/fpdk/updateExtra',
            data: {nsrsbh, djzt, sfztslqy, xfsh},
            dataType: 'json',
            success: function(res) {
                if (res != 1) {
                    Log('更新extra失败:' + xfsh);
                }
            },
            error: function(data,type, err) {
                Log('发送失败:' + err.message);
            }
        });
    }

    W.funcFpdkExtra = function(cert, token, xfsh) {
        $.ajax({
            type: "post",
            url: "https://fpdk.jiangsu.chinatax.gov.cn:81/NSbsqWW/fpmxcx.do",
            data: 'id=xfxxquery&cert=' + cert + '&token=' + token + '&xfsh=' + xfsh + '&ymbb=' + W.ymbb,
            dataType: "json",
            success: function(e) {
                if (e.key3) {
                    var t = e.key3.split('=');
                    if (t && t.length == 3) {
                        W.sendExtraData(t[2], t[0], t[1], xfsh);
                    }
                }
            },
            error: function(data,type, err) {
                Log('数据获取失败:' + err.message);
            }
        })
    }

    W.funcGetFpdkData = function() {
        Log('获取数据');
        W.DATA = '';
        var cert = W.ck.token.replace(/(^.*?@@)|(@@.*?$)/g, '');
        var now = new Date();
        var year = now.getYear() + 1900;
        var month = now.getMonth() + 1;
        var day = new Date(year, month, 0).getDate();
        var endDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
        var d = new Date(now.getTime() - 1000*3600*24*359);
        var dM = d.getMonth() + 1;
        var dD = d.getDate();
        var startDate = (d.getYear() + 1900) + '-' + (dM < 10 ? '0' + dM : dM) + '-' + (dD < 10 ? '0' + dD : dD);
        (function req(start) {
            $.ajax({
                type: "post",
                url: "https://fpdk.jiangsu.chinatax.gov.cn:81/NSbsqWW/dkgx.do",
                data: 'id=dkgxquery&fpdm=&fphm=&rq_q=' + startDate + '&rq_z=' + endDate + '&xfsbh=&rzzt=0&glzt=0&fpzt=0&fplx=01&cert=' + cert + '&token=' + unescape(W.ck.token) + '&aoData=%5B%7B%22name%22:%22iDisplayStart%22,%22value%22:' + start + '%7D,%7B%22name%22:%22iDisplayLength%22,%22value%22:1000%7D%5D&ymbb=' + W.ymbb,
                dataType: "json",
                success: function(e) {
                    Log('数据获取成功:' + e.key3.aaData.length);
                    W.sendData(unescape(W.ck.nsrmc), e.key3);
                    start += 1000
                    if (start < e.key4) {
                        req(start)
                    }
                },
                error: function(data,type, err) {
                    Log('数据获取失败:' + err.message);
                }
            })
        }(0))
    }

    W.funcFpdk = function() {
        Log('获取cookie');
        document.cookie.split(/;\s*/).forEach(e => {
            var t = e.split('=');
        W.ck[t[0]] = t[1];
    });
        Log('加载[发票抵扣勾选]页面');
        $('li[name="group_dk"]:eq(0)>a').click();
        Sto(function() {
            //Log('点击按钮');
            //$('#search').click();
            Sto(function() {
                W.funcGetFpdkData();
            }, 5000)
        }, 3000)
    }
    Sto(W.funcFpdk, 3000)
})();