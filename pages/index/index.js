var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        showFade: false,
        earAudit: false,
        isLogined: false,
        auditStatas: 1, // 1通过 2不通过
        order_no: ''
    },
    onLoad: function (options) {
        try {
            var scene = wx.getStorageSync('scene');
            console.log('进来了');
            var newScene = decodeURIComponent(options.scene);
            // console.log(scene);
            console.log(options.scene);
            console.log(123);
            //用户第一次进入
            if (scene == 'undefined' || scene == '') {
                // console.log('进来了');
                scene = newScene;
            } else if (scene != newScene) {
                scene = newScene;
            }
        } catch (e) {

        }
        wx.setStorageSync('scene', scene)
    },
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
                            wx.request({
                                url: globalData.apiURL + 'trading/order/all/custom/ear/audit?uid=' + uid,
                                success: function (res) {
                                    var res = res.data;
                                    if (res.success) {
                                        var earList = res.data;
                                        if(earList != null){
                                            if(earList.length > 0){
                                                var order_no = earList[0].order_no
                                                app.take_token(function (token) {
                                                    var token = token;
                                                    wx.request({
                                                        url: globalData.apiURL + 'trading/order/custom/ear/audit/notice',
                                                        method:'PUT',
                                                        data:{
                                                            token: token,
                                                            uid: uid,
                                                            order_no: order_no
                                                        },
                                                        success: function (res) {
                                                            var res = res.data;
                                                            if (res.success) {
                                                                t.setData({
                                                                    order_no: order_no,
                                                                    auditStatas: earList[0].status,
                                                                    earAudit: true
                                                                })
                                                            }
                                                        }
                                                    })
                                                })

                                            }
                                        }
                                    }
                                    // wx.hideLoading()
                                }
                            })
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
    closeAudit: function () {
        var t = this;
        t.setData({
            earAudit: false
        })
    },
    start: function () {
        try {
            wx.removeStorageSync('info')
            wx.removeStorageSync('price_info')
            wx.removeStorageSync('price_info_line')
            wx.removeStorageSync('price_info_peijian')
            wx.removeStorageSync('price_info_fenpin')
            wx.removeStorageSync('price_info_model')
            wx.redirectTo({
                url: '../design/fenpin/fenpin'
            })
        } catch (e) {
            // Do something when catch error
        }
    },
    goMenu: function () {
        var t = this;
        var showFade = t.data.showFade;
        t.setData({
            showFade: !showFade,
        })
    },
    //导航
    goNav: function (e) {
        var t = this;
        var destination = e.currentTarget.dataset.nav;
        switch (destination) {
            case 'index':     //主页
                t.setData({
                    showFade: false
                })
                break;
            case 'order':     //订单
                wx.navigateTo({
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
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toLogin: function () {
        var that = this;
        app.login(
            function () {
                that.setData({
                    isLogined: true
                })
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
    toOrder: function () {
        var t = this;
        var order_no = t.data.order_no
        app.login(function () {
            wx.getStorage({
                key: 'uid',
                success: function (res) {
                    var uid = res.data;
                    wx.request({
                        url: globalData.apiURL + 'trading/order/all/custom?uid=' + uid,
                        success: function (res) {
                            var res = res.data;
                            if (res.success) {
                                var orderList = res.data;
                                if (orderList) {
                                    for (var i = 0; i < orderList.length; i++) {
                                        if (orderList[i].order_id == order_no) {
                                            var kezi_color = orderList[i].lettering.color;
                                            var status = orderList[i].status_des;
                                            var keziContent = orderList[i].lettering.val;
                                            wx.navigateTo({
                                                url: '../order/detail/detail?order_no=' + order_no + '&kezi_color=' + kezi_color + '&status=' + status + '&keziContent=' + keziContent
                                            })
                                        }
                                    }
                                }
                                wx.hideLoading()
                            }
                        }
                    })
                }
            })
        })

    }
})
