//app.js
App({
    globalData: {
        //开发环境
        // apiURL: 'http://192.168./',
        // api_key: 'e38170f0db0a42bebbc61f92b74ba228',
        //正式环境
        apiURL:'https://.com/',
        api_key:'a98',
        code: '',
        isMock: true, //是否要使用mock
        isSubmit: false,
        linshi: false,
    },
    replacePos: function (strObj, pos, replacetext) {
        var str = strObj.substr(0, pos - 1) + replacetext + strObj.substring(pos, strObj.length);
        return str;
    },
    //去掉前后空格
    trim: function (s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 获取token
    take_token: function (cb) {
        var that = this;
        wx.request({
            url: that.globalData.apiURL + 'common/token/get?api-key=' + that.globalData.api_key,
            method: 'GET',
            success: function (res) {
                var res = res.data;
                if (res.success) {
                    cb(res.data.token);
                }
            }
        })
    },
    //去登录
    toLogin: function (cb, rq) {
        var that = this;
        var globalData = this.globalData;
        wx.login({
            success: function (res) {
                if (res.code) {
                    globalData.code = res.code;
                    wx.getUserInfo({
                        withCredentials: true,
                        success: function (res) {
                            var encryptedD = res.encryptedData;
                            var iV = res.iv
                            wx.request({
                                url: globalData.apiURL + 'common/token/get?api-key=' + globalData.api_key,
                                method: 'GET',
                                success: function (res) {
                                    var res = res.data;
                                    if (res.success) {
                                        var token = res.data.token;
                                        //向后台发送code
                                        wx.request({
                                            url: globalData.apiURL + 'ucenter/user/login/litapp',
                                            method: 'POST',
                                            data: {
                                                code: globalData.code,
                                                encrypted_data: encryptedD,
                                                iv: iV,
                                                token: token
                                            },
                                            success: function (res) {
                                                globalData.isSubmit = false;
                                                var res = res.data;
                                                if (res.success) {
                                                    try {
                                                        wx.setStorageSync('uid', res.data.uid)
                                                    } catch (e) {
                                                    }
                                                    //未注册
                                                    wx.hideLoading()
                                                    if (!res.data.is_login) {
                                                        if (rq) {
                                                            wx.navigateTo({
                                                                url: '/pages/login/login?rq=' + rq
                                                            })
                                                        } else {
                                                            wx.navigateTo({
                                                                url: '/pages/login/login'
                                                            })
                                                        }
                                                    } else {
                                                        if (cb) {
                                                            cb();
                                                        }
                                                        // console.log('已经注册过了哦！！！！可以跳转到订单详情了')
                                                    }
                                                }
                                            },
                                            fail: function (res) {
                                                // console.log('失败了litapp')
                                                // console.log(res)
                                            }
                                        })
                                    }
                                },
                                fail: function (res) {
                                    // console.log('失败了')
                                    // console.log(res)
                                }
                            })
                        }
                    })
                } else {
                    globalData.isSubmit = false;
                    // console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },
    //判断是否有登录
    login: function (cb, rq) {
        wx.showLoading({
            title: '加载中'
        })
        var that = this;
        var globalData = this.globalData;
        globalData.isSubmit = true;
        wx.getStorage({
            key: 'uid',
            success: function (res) {
                wx.request({
                    url: globalData.apiURL + 'ucenter/user/' + res.data,
                    method: 'GET',
                    success: function (res) {
                        var res = res.data;
                        if (res.success) {
                            //已经登录过了
                            globalData.isSubmit = false;
                            if (cb) {
                                cb();
                            }
                            // console.log('已经登录过了！！可以跳转到订单详情了');
                        } else {
                            that.toLogin(cb, rq);
                        }
                    }
                })
            },
            fail: function (res) {
                //第一次登录 或者没有缓存
                // console.log('第一次登录 或者没有缓存');
                wx.getUserInfo({
                    withCredentials: false,
                    success: function (res) {
                        try {
                            wx.setStorageSync('userInfo', res.userInfo)
                        } catch (e) {
                        }
                        that.toLogin(cb, rq);
                    },
                    fail: function (res) {
                        globalData.isSubmit = false;
                        wx.hideLoading()
                        wx.showModal({
                            title: '提示',
                            content: '小程序需要您的微信授权才能继续使用，请删除小程序重新授权',
                            cancelText: '取消',
                            confirmText: '确定',
                            success: function (res) {
                            },
                            fail: function () {
                            }
                        })
                    }
                })
            }
        })
    },
    //转化日期格式
    getDate: function (partten) {
        var t = new Date();
        if (partten == null || partten == '') {
            partten = 'y-m-d';
        }
        var y = t.getFullYear();
        var m = t.getMonth() + 1;
        var d = t.getDate();
        var r = partten.replace(/y+/gi, y);
        r = r.replace(/m+/gi, (m < 10 ? "0" : "") + m);
        r = r.replace(/d+/gi, (d < 10 ? "0" : "") + d);
        return r;
    },
    //打开设置
    openSetting: function () {
        var that = this
        if (wx.openSetting) {
            wx.openSetting({
                success: function (res) {
                    //尝试再次登录
                    that.login()
                }
            })
        } else {
            wx.showModal({
                title: '授权提示',
                content: '您的小程序版本过低，请升级。（或者采用以下方法：删除小程序->重新搜索进入->点击授权按钮）'
            })
        }
    },
    //判断输入的手机格式是否正确
    check_iphone: function (m) {
        if (m.length == 0) {
            return '手机号不能为空';
        } else {
            var mobile = /^((13\d{9})|(18\d{9})|(14[57]\d{8})|(17[035678]\d{8})|(15\d{9}))$/;
            if (!mobile.test(m)) {
                return '请输入正确的手机格式';
            }
        }
        return false;
    },
    //判断输入的昵称是否只包含数字、字母和中文
    check_name: function (n) {
        var name = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        if (!name.test(n)) {
            return false
        }
        return true
    },
    //判断字符长度，中文算两个字符
    StringLen: function (str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len++;
            }
        }
        return len;
    },
    //判断刻字内容是否符合规范
    check_kezi: function (str) {
        var cn = 0;
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                cn++;
                len += 2;
            } else {
                len++;
            }
        }
        return len
    },
})
