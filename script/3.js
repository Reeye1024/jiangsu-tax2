// ==UserScript==
// @name         发票抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Reeye
// @match        https://fpdk.jiangsu.chinatax.gov.cn:81/main*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let W = window;
    W.ck = {};

    W.toast = function(msg) {
        layer.msg(msg, {offset: '90%'});
    };

    function groupBy(array, f) {
        let groups = {};
        array.forEach(function (o) {
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    }

    W.sendData = function (data) {
        Log('发送数据');
        let nsrmc = unescape(W.ck.nsrmc);
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/fpdk/batchSave?nsrmc=' + nsrmc,
            contentType: 'application/json',
            timeout: 3600000, // one hour
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (res) {
                toast('新增' + res.saveCount + '条数据');
                Log('新增' + res.saveCount + '条数据');
                errBreak();
                if (res.xfshs && res.xfshs.length > 0) {
                    let groups = {};
                    res.xfshs.forEach(function (e) {
                        let group = e[0];
                        groups[group] = groups[group] || [];
                        groups[group].push(e);
                    });
                    let xfshs = Object.keys(groups).map(function (group) {
                        return groups[group];
                    });
                    Log('共需要获取' + xfshs.length + '个企业详情数据');
                    let index = {no: 0};
                    let cert = W.ck.token.replace(/(^.*?@@)|(@@.*?$)/g, '');
                    let token = unescape(W.ck.token);
                    W.timer = Siv(() => {
                        W.funcFpdkExtra(cert, token, xfshs[index.no++], index.no >= res.xfshs.length - 1);
                    }, 1000);
                    Log('详情timer: ' + timer);
                } else {
                    Log('发送完毕');
                }
            },
            error: function (data, type, err) {
                Log('发送失败:', data, type, err);
                toast('发送失败:' + err.message);
                errBreak(err);
            }
        });
    };

    W.sendExtraData = function (nsrsbh, djzt, sfztslqy, xfmc) {
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/fpdk/updateExtra',
            data: {nsrsbh, djzt, sfztslqy, xfmc},
            success: function (res) {
                Log('更新extra ' + xfmc + '结果:' + res);
            },
            error: function (data, type, err) {
                Log('发送失败:' + err.message);
            }
        });
    };

    W.funcFpdkExtra = function (cert, token, xfsh, flag) {
        let index = {no: 0};
        let func = function (resolve, reject) {
            if (index.no >= xfsh.length) {
                reject()
            }
            let i = index.no++;
            if (xfsh[i][1]) {
                $.ajax({
                    type: "post",
                    url: "https://fpdk.jiangsu.chinatax.gov.cn:81/NSbsqWW/fpmxcx.do",
                    data: 'id=xfxxquery&cert=' + cert + '&token=' + token + '&xfsh=' + xfsh[i][1] + '&ymbb=' + W.ymbb,
                    dataType: "json",
                    success: function (e) {
                        if (flag) {
                            Log('获取详情数据完毕');
                            clearInterval(W.timer);
                        }
                        resolve(e);
                    },
                    error: function (data, type, err) {
                        if (flag) {
                            clearInterval(W.timer);
                            Log('timer cleared');
                        }
                        Log('数据获取失败:' + err.message);
                        resolve();
                    }
                })
            }
        };
        let failed = function (err) {
        };
        let thenFunc = function (data) {
            if (data.key3 != null) {
                let t = data.key3.split('=');
                if (t && (t.length === 3)) {
                    W.sendExtraData(t[2], t[0], t[1], xfsh[index.no - 1][0]);
                }
            } else {
                return new Promise(func).then(thenFunc).catch(failed);
            }
        };
        new Promise(func).then(thenFunc).catch(failed);
    };

    function errBreak(err) {
        $('#reeye').attr('status', 'prepared').css('filter', 'none').css("cursor", "pointer");
    }

    W.funcGetFpdkData = function () {
        Log('获取数据');
        let Data = [];
        let page = {start: 0, size: 500};
        let cert = W.ck.token.replace(/(^.*?@@)|(@@.*?$)/g, '');
        let now = new Date();
        let year = now.getYear() + 1900;
        let month = now.getMonth() + 1;
        let day = new Date(year, month, 0).getDate();
        let endDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
        let d = new Date(now.getTime() - 1000 * 3600 * 24 * 359);
        let dM = d.getMonth() + 1;
        let dD = d.getDate();
        let startDate = (d.getYear() + 1900) + '-' + (dM < 10 ? '0' + dM : dM) + '-' + (dD < 10 ? '0' + dD : dD);
        toast('设置时间:' + startDate + '至' +  endDate)
        let func = function (resolve, reject) {
            $.ajax({
                type: "post",
                url: "https://fpdk.jiangsu.chinatax.gov.cn:81/NSbsqWW/dkgx.do",
                data: 'id=dkgxquery&fpdm=&fphm=&rq_q=' + startDate + '&rq_z=' + endDate + '&xfsbh=&rzzt=0&glzt=0&fpzt=0&fplx=01&cert=' + cert + '&token=' + unescape(W.ck.token) + '&aoData=%5B%7B%22name%22:%22iDisplayStart%22,%22value%22:' + page.start + '%7D,%7B%22name%22:%22iDisplayLength%22,%22value%22:' + page.size + '%7D%5D&ymbb=' + W.ymbb,
                dataType: "json",
                success: function (data) {
                    resolve(data);
                },
                error: function (data, type, err) {
                    Log('数据获取失败:' + err.message);
                    reject(err);
                }
            })
        };
        let thenFunc = function (data) {
            Log('数据获取成功:' + data.key3.aaData.length);
            if (data.key3 && data.key3.aaData && data.key3.aaData.length > 0) {
                Data = Data.concat(data.key3.aaData)
            }
            page.start += 500;
            if (page.start < data.key4) {
                return new Promise(func).then(thenFunc).catch(errBreak);
            } else {
                toast('数据获取完毕:' + Data.length + '条');
                if (Data.length > 0) {
                    W.sendData(Data);
                }
            }
        };
        new Promise(func).then(thenFunc).catch(errBreak);
    };

    W.funcFpdk = function () {
        Log('获取cookie');
        document.cookie.split(/;\s*/).forEach(e => {
            let t = e.split('=');
            W.ck[t[0]] = t[1];
        });
        toast('加载[发票抵扣勾选]页面');
        $('li[name="group_dk"]:eq(0)>a').click();
        Sto(function () {
            Sto(function () {
                W.funcGetFpdkData();
            }, 5000)
        }, 3000)
    };

    $('body').append('<div id="reeye" style="position: fixed;top: 230px;right: 10px;background: #2fb92f;cursor: pointer;padding: 10px 6px;border-radius: 4px;color: #fff;z-index: 999;" status="prepared">抓取[发票抵扣勾选]</div>');
    $('#reeye').click(() => {
        // document.cookie.split(/;\s*/).forEach(e => {
        //     let t = e.split('=');
        //     W.ck[t[0]] = t[1];
        // });
        // sendData([])
        if ($('#popup_message').is(':visible') && $('#popup_message').text().indexOf('重新登录') > 0) {
            toast('即将跳转到登录页面');
            Sto(() => {
                $('#popup_ok').click();
            }, 2000);
        } else {
            let status = $('#reeye').attr('status');
            if (status === 'prepared') {
                $('#reeye').attr('status', 'running').css('filter', 'grayscale(1)').css("cursor", "not-allowed");
                funcFpdk();
            }
        }
    });
})();