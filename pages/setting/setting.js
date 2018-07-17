var app = getApp();
var globalData = app.globalData;
Page({

    data: {
        yellow_tip: false,
        green_tip: false,
        err_content: '',
        setTimeout_time: null,
        setTimeout_time2: null,
        tankuang: false,
    },
    cancelAction: function () {
        this.setData({
            tankuang: false
        })
    },
    confirmAction: function () {
        this.setData({
            tankuang: false
        })
        this.clearAction()
    },
    toClearAction: function () {
        this.setData({
            tankuang: true
        })
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
    clearAction: function () {
        var that = this;
        this.setData({
            green_tip: false,
            yellow_tip: true,
            err_content: '正在处理缓存..'
        })
        wx.clearStorageSync()
        clearTimeout(that.data.setTimeout_time2);
        that.data.setTimeout_time2 = setTimeout(function () {
            that.setData({
                yellow_tip: false,
                green_tip: true,
                err_content: '清理完成!'
            })
        }, 1000)

        clearTimeout(that.data.setTimeout_time);
        that.data.setTimeout_time = setTimeout(function () {
            that.setData({
                green_tip: false,
            })
        }, 2000)
    },
    onLoad: function (options) {

    },
    onReady: function () {

    },
    onShow: function () {
        var that = this;
        wx.getStorage({
            key: 'uid',
            success: function (res) {
                wx.request({
                    url: globalData.apiURL + 'ucenter/user/' + res.data,
                    method: 'GET',
                    success: function (res) {
                        var res = res.data;
                        if (res.success) {
                            that.setData({
                                isLogined: true
                            })

                        } else {
                            that.setData({
                                isLogined: false
                            })
                        }
                    }
                })
            },
            fail: function (res) {
                that.setData({
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