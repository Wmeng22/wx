var app = getApp();
var globalData = app.globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uid: '',
        order_no: '',
        flag: true,
        price: '',
        tankuang: false,
    },
    doExit: function () {
        this.setData({
            tankuang: true
        })
    },
    cancelAction: function () {
        this.setData({
            tankuang: false
        })
    },
    confirmAction: function () {
        this.setData({
            tankuang: true
        })
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    pay: function () {
        var that = this;
        if (that.data.flag) {
            that.setData({
                flag: false
            })
            app.login(
                function () {
                    wx.getStorage({
                        key: 'uid',
                        success: function (res) {
                            that.setData({
                                uid: res.data
                            })
                            wx.request({
                                url: app.globalData.apiURL + 'trading/pay/weixin/lit-app-pay/' + that.data.order_no + '?uid=' + that.data.uid,
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: function (res) {
                                    var res = res.data;
                                    if (res.success) {
                                        var lit_app_info = JSON.parse(res.data.lit_app_info);
                                        wx.requestPayment({
                                            'timeStamp': lit_app_info.timeStamp,
                                            'nonceStr': lit_app_info.nonceStr,
                                            'package': lit_app_info.package,
                                            'signType': lit_app_info.signType,
                                            'paySign': lit_app_info.paySign,
                                            'success': function (res) {
                                                // wx.redirectTo({
                                                //     url: '/pages/add/pay_success/pay_success?order_no=' + that.data.order_no
                                                // })  
                                                wx.reLaunch({
                                                    url: '/pages/toPay/pay_success/pay_success?order_no=' + that.data.order_no
                                                })
                                            },
                                            'fail': function (res) {
                                            }
                                        })
                                    }
                                },
                                complete: function () {
                                    that.setData({
                                        flag: true
                                    })
                                    wx.hideLoading()
                                }
                            })
                        }
                    })
                })
        }
        // app.login()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var order_no = options.order_no
        this.setData({
            order_no: order_no,
            // price: options.price
        })
        app.login(function () {
            wx.getStorage({
                key: 'uid',
                success: function (res) {
                    var uid = res.data;
                    wx.request({
                        url: globalData.apiURL + 'trading/order/get/custom/' + order_no + '?uid=' + uid,
                        success:function (res){
                            var res = res.data;
                            if(res.success){
                                that.setData({
                                    price:res.data.order_amt
                                })
                                wx.hideLoading()
                            }
                        }
                    })
                }
            })
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})