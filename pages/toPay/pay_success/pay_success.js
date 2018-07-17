// pay_success.js
Page({
    /**
     * 页面的初始数据
     */
    data: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var order_no = options.order_no;
        try {
            var info = wx.getStorageSync('info')
            if (info) {
                var model = info.err.pty_list[8].pty_num
                this.setData({
                    order_no: order_no,
                    model: model
                })
                console.log(model);
            }
        } catch (e) {
            // Do something when catch error
        }


    },
    order_detail: function () {
        var that = this;
        wx.reLaunch({
            url: '/pages/order/order'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    toMap: function (){
        wx.redirectTo({
            url: '../baidu_map/baidu_map'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})