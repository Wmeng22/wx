// pages/design/tutorial/tutorial.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: false,
        autoplay: false,
        prolist: [1, 2, 3, 4, 5],
        active: 0,
        isPrivate: true
    },
    swiperChange: function (e) {
        var current = e.detail.current;
        if(current == this.data.current_i){
            wx.redirectTo({
                url: '/pages/design/named/named'
            })
        }
        this.setData({
            active: current,
        })
    },
    goOut: function () {
        wx.redirectTo({
            url: '/pages/design/named/named'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pid =  options.pid;
        var model =  options.model;
        var prolist = '';
        var current_i = 3;
        var isPrivate = false;
        if(model == 'PUBLICMODEL'){
            prolist = [1,2,3]
        }else{
            isPrivate = true;
            prolist = [1,2,3,4,5];
            current_i = 5;
        }
        this.setData({
            pid: pid,
            isPrivate:isPrivate,
            prolist:prolist,
            current_i:current_i
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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