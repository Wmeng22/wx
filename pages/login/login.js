var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        err_tip: true,
        iphone: '',//输入的电话号码
        code: '',//输入的验证码
        code_status: '发送验证码',
        isCorrect: false,
        isWrong: false,
        code_tip: false,
        iphone_err: false,
        sending: false,
        count: 60,
        iphone_err_tip: '',
        setTimeout_time: null
        // avatar: 'https://static.heys.com/wxapp/imgs/avatar.png'
    },
    submit: function () {
        var that = this;
        var globalData = app.globalData;
        var result = app.check_iphone(that.data.iphone);
        if (!result) {
            // if (!that.data.sending) {
            // console.log('开始验证 验证码')
            if (that.data.code.length === 0) {
                that.setData({
                    code_tip: true
                })
            } else {
                if (that.data.sid) {
                    app.take_token(
                        function (token) {
                            var data = that.data;
                            wx.request({
                                url: globalData.apiURL + 'common/sms/code/verify',
                                method: 'POST',
                                data: {
                                    token: token,
                                    sid: data.sid,
                                    mobile: data.iphone,
                                    verify_code: data.code,
                                    type: 101
                                },
                                success: function (res) {
                                    var res = res.data;
                                    if (res.success) {
                                        if (res.data.is_valid) {
                                            that.setData({
                                                isWrong: false,
                                                isCorrect: true
                                            })
                                            app.take_token(
                                                function (token) {
                                                    var data = that.data;
                                                    var userInfo = '';
                                                    wx.getStorage({
                                                        key: 'userInfo',
                                                        success: function (res) {
                                                            userInfo = res.data;
                                                            // console.log(userInfo);
                                                            var sex = '';
                                                            if (userInfo.gender == 2) {
                                                                sex = 0;
                                                            } else {
                                                                sex = 1
                                                            }
                                                            wx.request({
                                                                url: globalData.apiURL + 'ucenter/user/register/litapp',
                                                                method: 'POST',
                                                                data: {
                                                                    token: token,
                                                                    uid: data.uid,
                                                                    sid: data.sid,
                                                                    mobile: data.iphone,
                                                                    verify_code: data.code,
                                                                    // nickname: userInfo.nickName,
                                                                    headimg: userInfo.avatarUrl,
                                                                    sex: sex
                                                                },
                                                                success: function (res) {
                                                                    var res = res.data;
                                                                    var url = that.data.url;
                                                                    // console.log(url);
                                                                    // console.log('要跳转的地址啊')
                                                                    if (res.success && !url) {
                                                                        // console.log('走了navigateBack')
                                                                        wx.navigateBack({
                                                                            delta: 1
                                                                        })
                                                                    } else if (res.success && url) {
                                                                        // console.log('走了redirectTo')
                                                                        wx.redirectTo({
                                                                            url: url
                                                                        })
                                                                    }
                                                                    else {
                                                                        if (res.err_code == 11074) {
                                                                            that.isTopErr('该手机号已经被注册，请重新填写')
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            )
                                        } else {
                                            that.setData({
                                                isWrong: true,
                                                isCorrect: false
                                            })
                                        }

                                    }
                                }
                            })
                        }
                    )
                } else {
                    that.isTopErr('请点击发送验证码')
                }

            }
        } else {
            that.isTopErr(result)
        }
    },
    isTopErr: function (s) {
        var that = this;
        that.setData({
            iphone_err: true,
            iphone_err_tip: s
        })
        clearTimeout(that.data.setTimeout_time);
        that.data.setTimeout_time = setTimeout(function () {
            that.setData({
                iphone_err: false,
            })
        }, 2000)
    },
    isCodeNull: function (e) {
        var flag = '';
        if (e.detail.value.length === 0) {
            flag = true
        } else {
            flag = false
        }
        this.setData({
            code: e.detail.value,
            code_tip: flag
        })
    },
    iphoneBlur: function (e) {
        this.setData({
            iphone: e.detail.value
        })
    },
    // codeInput:function(e) {
    //   this.setData({
    //     code: e.detail.value
    //   })
    // },

    send_code: function () {
        var that = this;
        var globalData = app.globalData;
        var result = app.check_iphone(this.data.iphone);
        if (!result) {
            if (!that.data.sending) {
                that.setData({
                    sending: true
                })
                app.take_token(
                    function (token) {
                        wx.request({
                            url: globalData.apiURL + 'common/sms/code?token=' + token + '&mobile=' + that.data.iphone + '&type=101',
                            method: 'GET',
                            success: function (res) {
                                var res = res.data;
                                if (res.success) {
                                    console.log(res.err_msg)
                                    that.setData({
                                        sid: res.data.sid
                                    })
                                    // console.log(res.data.sid)
                                }
                            }
                        })
                    }
                )
                app.timer = setInterval(function () {
                    var count = that.data.count - 1;
                    that.setData({
                        count: count,
                        code_status: '重新发送(' + count + ')'
                    })
                    if (count < 1) {
                        clearInterval(app.timer);
                        count = 60;
                        that.setData({
                            count: 60,
                            code_status: '重新发送(' + count + ')',
                            sending: false
                        })
                    }
                }, 1000)
            }
        } else {
            that.isTopErr(result)
        }
    },
    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: 'uid',
            success: function (res) {
                that.setData({
                    uid: res.data
                })
            }
        })
        // console.log('这是options')
        // console.log(options)
        // console.log(options.rq)
        if (options) {
            this.setData({
                url: options.rq
            })
        }
        // var that = this;
        // var userInfo = app.globalData.userInfo;
        // if(userInfo){
        //   that.setData({
        //     avatar:userInfo.avatarUrl
        //   })
        // }else{
        //   that.setData({
        //     avatar:'https://static.heys.com/wxapp/imgs/avatar.png'
        //   })
        // }
    },
    goMenu: function (){
        var t = this;
        var showFade = t.data.showFade;
        t.setData({
            showFade: !showFade
        })
    },
    toLogin: function () {
        var that = this;
        app.login(
            function () {
                that.setData({
                    isLogined: true
                })
                wx.hideLoading()
            }
        )
    },
    cancelLogin: function () {
        var that = this;
        wx.removeStorage({
            key: 'uid',
            success: function (res) {
                that.setData({
                    isLogined: false
                })
            }
        })
    },
    goNav: function (e){
        var t = this;
        var destination = e.currentTarget.dataset.nav;
        switch (destination) {
            case 'index':     //主页
                wx.reLaunch({
                    url: '../index/index'
                })
                break;
            case 'order':     //订单
                wx.reLaunch({
                    url: '../order/order'
                })
                break;
            case 'setting':     //设置
                wx.navigateTo({
                    url: '../setting/setting'
                })
                break;
            default:    //登录或注册
        }
    },
    // chooseAvatar:function() {
    //    var that = this;
    //     wx.chooseImage({
    //        count: 1, // 默认9
    //        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //        success: function (res) {
    //          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //          var tempFilePaths = res.tempFilePaths;
    //          // upload(that, tempFilePaths);
    //          that.setData({avatar:tempFilePaths})
    //        }
    //  })
    // },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {


    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var t = this;
        wx.getStorage({
            key: 'uid',
            success: function (res) {
                var uid = res.data;
                wx.request({
                    url: globalData.apiURL + 'ucenter/user/' + res.data,
                    method: 'GET',
                    success: function (res) {
                        var res = res.data;
                        if (res.success) {
                            t.setData({
                                isLogined:true
                            })
                            //已经登录过了
                            // console.log('已经登录过了！！可以跳转到订单详情了');
                        }
                        else {       //没有登陆
                            t.setData({
                                isLogined: false
                            })
                        }
                    }
                })
            },
            fail: function (res) {
                t.setData({
                    isLogined: false
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})