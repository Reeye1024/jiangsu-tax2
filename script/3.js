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
                $('#reeye').attr('status', 'prepared').css('filter', 'none').css("cursor", "pointer");
                // if (res.xfshs && res.xfshs.length > 0) {
                //     let groups = {};
                //     res.xfshs.forEach(function (e) {
                //         let group = e[0];
                //         groups[group] = groups[group] || [];
                //         groups[group].push(e);
                //     });
                //     let xfshs = Object.keys(groups).map(function (group) {
                //         return groups[group];
                //     });
                //     Log('共需要获取' + xfshs.length + '个企业详情数据');
                //     // let index = {no: 0};
                //     // let cert = W.ck.token.replace(/(^.*?@@)|(@@.*?$)/g, '');
                //     // let token = unescape(W.ck.token);
                //     // W.timer = Siv(() => {
                //     //     W.funcFpdkExtra(cert, token, xfshs[index.no++], index.no >= res.xfshs.length - 1);
                //     // }, 1000);
                //     // Log('详情timer: ' + timer);
                //     xfshs.forEach(e => {
                //         Log('single search: ' + e[0][0]);
                //         W.funcGetFpdkData(e[0]);
                //     })
                // } else {
                //     Log('发送完毕');
                // }
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

    // xfsh: [[xfmc,xfsh,fpdm,fphm], []]
    W.funcFpdkExtra = function (cert, token, xfsh, endFlag, delXfsh) {
        let index = {no: 0};
        let func = function (resolve, reject) {
            if (index.no >= xfsh.length) {
                reject()
            }
            let i = index.no++;
            if (xfsh[i][1]) {
                let code = xfsh[i][1].endsWith('%3D') ? xfsh[i][1] : encodeURIComponent(xfsh[i][1]);
                $.ajax({
                    type: "post",
                    url: "https://fpdk.jiangsu.chinatax.gov.cn:81/NSbsqWW/fpmxcx.do",
                    data: 'id=xfxxquery&cert=' + cert + '&token=' + token + '&xfsh=' + code + '&ymbb=' + W.ymbb,
                    dataType: "json",
                    success: function (e) {
                        if (endFlag) {
                            Log('获取详情数据完毕');
                            clearInterval(W.timer);
                        }
                        resolve(e);
                    },
                    error: function (data, type, err) {
                        if (endFlag) {
                            clearInterval(W.timer);
                            Log('timer cleared');
                        }
                        Log('数据获取失败:' + err.message);
                        resolve();
                    }
                })
            }
        };
        let failed = function (err) {};
        let thenFunc = function (data) {
            if (data && data.key3) {
                let t = data.key3.split('=');
                if (t && (t.length === 3)) {
                    W.sendExtraData(t[2], t[0], t[1], xfsh[index.no - 1][0]);
                }
            } else {
                if (delXfsh) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://127.0.0.1:8080/fpdk/updateXfshNull',
                        data: { xfsh: xfsh[0][1] },
                        success: function (res) {
                            if (res !== 1) {
                                Log("置空失败:" + xfsh[0][1])
                            }
                        },
                        error: function (data, type, err) {
                            Log('发送失败:' + err.message);
                        }
                    });
                } else {
                    return new Promise(func).then(thenFunc).catch(failed);
                }
            }
        };
        new Promise(func).then(thenFunc).catch(failed);
    };

    function errBreak(err) {
        Log('errBreak():' + JSON.stringify(err));
        $('#reeye').attr('status', 'prepared').css('filter', 'none').css("cursor", "pointer");
    }

    W.funcGetFpdkData = function (dd) {
        if (!dd) {
            Log('获取数据');
        }
        let Data = [];
        let page = {start: 0, size: 500};
        let cert = W.ck.token.replace(/(^.*?@@)|(@@.*?$)/g, '');
        let ssq = $('#ssq').text();
        let year = parseInt(ssq);
        let month = parseInt(ssq.substring(5));
        let eDate = new Date(year, month, 0);
        let day = eDate.getDate();
        let endDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
        let d = new Date(new Date().getTime() - 1000 * 3600 * 24 * 359);
        let dM = d.getMonth() + 1;
        let dD = d.getDate();
        let startDate = (d.getYear() + 1900) + '-' + (dM < 10 ? '0' + dM : dM) + '-' + (dD < 10 ? '0' + dD : dD);
        if (!dd) {
            toast('设置时间:' + startDate + '至' +  endDate)
        }
        let func = function (resolve, reject) {
            var other = "id=dkgxquery&fpdm={}&fphm={}";
            other = other.replace(/{}/, dd ? dd[2] : '');
            other = other.replace(/{}/, dd ? dd[3] : '');
            $.ajax({
                type: "post",
                url: "https://fpdk.jiangsu.chinatax.gov.cn:81/NSbsqWW/dkgx.do",
                data: other + '&rq_q=' + startDate + '&rq_z=' + endDate + '&xfsbh=&rzzt=0&glzt=0&fpzt=0&fplx=01&cert=' + cert + '&token=' + unescape(W.ck.token) + '&aoData=%5B%7B%22name%22%3A%22sEcho%22%2C%22value%22%3A1%7D%2C%7B%22name%22%3A%22iColumns%22%2C%22value%22%3A15%7D%2C%7B%22name%22%3A%22sColumns%22%2C%22value%22%3A%22%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%22%7D%2C%7B%22name%22%3A%22iDisplayStart%22%2C%22value%22%3A' + page.start + '%7D%2C%7B%22name%22%3A%22iDisplayLength%22%2C%22value%22%3A' + page.size + '%7D%2C%7B%22name%22%3A%22mDataProp_0%22%2C%22value%22%3A0%7D%2C%7B%22name%22%3A%22mDataProp_1%22%2C%22value%22%3A1%7D%2C%7B%22name%22%3A%22mDataProp_2%22%2C%22value%22%3A2%7D%2C%7B%22name%22%3A%22mDataProp_3%22%2C%22value%22%3A3%7D%2C%7B%22name%22%3A%22mDataProp_4%22%2C%22value%22%3A4%7D%2C%7B%22name%22%3A%22mDataProp_5%22%2C%22value%22%3A5%7D%2C%7B%22name%22%3A%22mDataProp_6%22%2C%22value%22%3A6%7D%2C%7B%22name%22%3A%22mDataProp_7%22%2C%22value%22%3A7%7D%2C%7B%22name%22%3A%22mDataProp_8%22%2C%22value%22%3A8%7D%2C%7B%22name%22%3A%22mDataProp_9%22%2C%22value%22%3A9%7D%2C%7B%22name%22%3A%22mDataProp_10%22%2C%22value%22%3A10%7D%2C%7B%22name%22%3A%22mDataProp_11%22%2C%22value%22%3A11%7D%2C%7B%22name%22%3A%22mDataProp_12%22%2C%22value%22%3A12%7D%2C%7B%22name%22%3A%22mDataProp_13%22%2C%22value%22%3A13%7D%2C%7B%22name%22%3A%22mDataProp_14%22%2C%22value%22%3A14%7D%5D&ymbb=' + W.ymbb,
                dataType: "json",
                success: function (data) {
                    if (dd) {
                        data.dd = dd;
                    }
                    resolve(data);
                },
                error: function (data, type, err) {
                    Log('数据获取失败:' + err.message);
                    reject(err);
                }
            })
        };
        let thenFunc = function (data) {
            if (data.key3 && data.key3.aaData && data.key3.aaData.length > 0) {
                if (!data.dd) {
                    Log('数据获取成功:' + data.key3.aaData.length);
                    Data = Data.concat(data.key3.aaData);
                    page.start += 500;
                    if (page.start < data.key4) {
                        return new Promise(func).then(thenFunc).catch(errBreak);
                    } else {
                        toast('数据获取完毕:' + Data.length + '条');
                        if (Data.length > 0) {
                            W.sendData(Data);
                        }
                    }
                } else {
                    let itemRes = data.key3.aaData[0];
                    let cert = W.ck.token.replace(/(^.*?@@)|(@@.*?$)/g, '');
                    let token = unescape(W.ck.token);
                    let match = itemRes[14].match(/(\w|%)+3D/g, '');
                    if (match && match[0]) {
                        W.funcFpdkExtra(cert, token, [[itemRes[4], match[0]]], false, true);
                    } else {
                        Log('not match:' + itemRes[14]);
                    }
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
            W.funcGetFpdkData();
        }, 3000)
    };

    $('body').append('<div id="reeye" style="position: fixed;top: 230px;right: 10px;background: #2fb92f;cursor: pointer;padding: 10px 6px;border-radius: 4px;color: #fff;z-index: 999;" status="prepared">立即抓取[发票抵扣勾选]</div>');
    $('body').append('<div id="reeye2" style="position: fixed;top: 275px;right: 10px;background: #2fb92f;cursor: pointer;padding: 10px 6px;border-radius: 4px;color: #fff;z-index: 999;" status="prepared">定时抓取[发票抵扣勾选]</div>');
    $('#reeye').click(() => {
        // document.cookie.split(/;\s*/).forEach(e => {
        //     let t = e.split('=');
        //     W.ck[t[0]] = t[1];
        // });
        // $('li[name="group_dk"]:eq(0)>a').click();
        // Sto(function () {
        //     sendData([])
        // }, 2000)
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

    var schedule = localStorage.getItem('schedule');
    $('#reeye2').text(schedule ? '已开启定时抓取:' + schedule + '分钟' : '定时抓取[发票抵扣勾选]');
    $('#reeye2').click(() => {
        if ($('#reeye2').text().indexOf('已开启') === 0) {
            localStorage.removeItem('schedule');
            $('#reeye2').text('定时抓取[发票抵扣勾选]');
            toast('已关闭定时抓取');
        } else {
            schedule = 60;
            localStorage.setItem('schedule', schedule);
            $('#reeye2').text('已开启定时抓取:' + schedule + '分钟');
            toast('已开启定时抓取:' + schedule + '分钟，请保持自动登录脚本打开');
            Sto(() => {
                quit();
                Sto(() => { $('#popup_ok').click() }, 300);
            }, 1000 * 60 * parseInt(schedule));
        }
    });
    Sto(() => {
        if ($('#popup_message').is(':visible') && $('#popup_message').text().indexOf('重新登录') > 0) {
            Sto(() => {
                $('#popup_ok').click();
            }, 2000);
        } else {
            if (schedule) {
                $('#reeye').click();
                // Log('执行任务~~');
            }
        }
    }, 1000);
})();