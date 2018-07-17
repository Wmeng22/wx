var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        active: 0,
        animationData: {},
        orderList: [],
        isNull: false,
        stopPropagation: true
    },
    chooseOrder: function (e) {
        var that = this;
        var dataset = e.currentTarget.dataset;
        var order_no = dataset.no;
        var idx = dataset.idx;
        var status = dataset.status;
        var kezi_color = that.data.orderList[idx].kezi_color;
        var keziContent = dataset.kezicontent;
            wx.navigateTo({
                url: 'detail/detail?order_no=' + order_no + '&kezi_color=' + kezi_color + '&status=' + status + '&keziContent=' + keziContent
            })
    },
    choose: function (e) {
        this.setData({
            active: e.target.dataset.idx
        })
        var animation = wx.createAnimation({
            // transformOrigin:50% 50%,
            duration: 300,
            timingFunction: "ease-out",
            delay: 0
        })
        animation.translateX(70 * this.data.active).step();
        this.setData({
            animationData: animation.export()
        })
    },
    //导航
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
                t.setData({
                    showFade: false
                })
                t.onLoad();
                break;
            case 'setting':     //设置
                wx.navigateTo({
                    url: '../setting/setting'
                })
                break;
            default:    //登录或注册
        }
    },
    goMenu: function (){
        var t = this;
        var showFade = t.data.showFade;
        t.setData({
            showFade: !showFade
        })
    },
    onLoad: function (options) {
        var that = this;
        app.login(function () {
            wx.getStorage({
                key: 'uid',
                success: function (res) {
                    var uid = res.data;
                    // that.setData({
                    //     isLogined:true
                    // })
                    wx.request({
                        url: globalData.apiURL + 'trading/order/all/custom?uid=' + uid,
                        success: function (res) {
                            var res = res.data;
                            if(res.success){
                                var orderList = res.data;
                                if (orderList) {
                                    that.setData({
                                        isNull: false,
                                        orderList: orderList
                                    })
                                    for (var i = 0; i < orderList.length; i++) {
                                        //     for (var j = 0; j < orderList[i].prodlist.length; j++) {
                                        //         if (orderList[i].prodlist[j].prod_cid == 10103) {
                                        //             orderList[i].order_img = orderList[i].prodlist[j].sku_litimg
                                        //             var customlist = orderList[i].prodlist[j].customlist;
                                        //             if(customlist.length > 0){
                                        //                 orderList[i].kezi_content = customlist[0].ptyvalue;
                                        //                 orderList[i].kezi_color = customlist[0].custom_ptydes;
                                        //
                                        //             }else{
                                        //                 orderList[i].kezi_content = '';
                                        //                 orderList[i].kezi_color = '#fff';
                                        //                 console.log( orderList[i]);
                                        //             }
                                        //         }
                                        //     }
                                        //
                                        orderList[i].kezi_content = orderList[i].lettering.val;
                                        orderList[i].kezi_color = orderList[i].lettering.color;
                                        var d = new Date(orderList[i].create_date);
                                        orderList[i].create_date = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
                                    }
                                } else {
                                    that.setData({
                                        isNull: true
                                    })
                                }
                                that.setData({
                                    orderList: orderList
                                })
                                wx.hideLoading()
                            }

                        }
                    })
                }
            })
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
        wx.showLoading({
            title: '加载中'
        })
        wx.removeStorage({
            key: 'uid',
            success: function (res) {
                wx.hideLoading()
                that.setData({
                    isLogined: false
                })
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
})