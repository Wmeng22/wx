// pages/order/detail/makerecordlist/makerecordlist.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        makerecordlist: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var status = options.status;
        var dlvr_date = options.dlvr_date

        var that = this;
        try {
            var makerecordlist = wx.getStorageSync('makerecordlist');
            var makerecordlist_now = [];
            var tmp1 = [];
            var tmp2 = [];
            var tmp3 = [];
            var tmp4 = []
            for (var i = 0; i < makerecordlist.length; i++) {
                if (makerecordlist[i].flow_seq == 1) {
                    tmp1.push(makerecordlist[i]);
                    if (makerecordlist[i].audit_user == "") {
                        tmp1[0].img = 'https://static.heys.com/wxapp/imgs/icon_printing_nor@2x.png';
                    } else {
                        tmp1[0].img = 'https://static.heys.com/wxapp/imgs/icon_printing_sel@2x.png';
                    }
                } else if (makerecordlist[i].flow_seq == 2) {
                    tmp2.push(makerecordlist[i])
                    if (makerecordlist[i].audit_user == "") {
                        tmp2[0].img = 'https://static.heys.com/wxapp/imgs/icon_assemble_nor@2x.png';
                    } else {
                        tmp2[0].img = 'https://static.heys.com/wxapp/imgs/icon_assemble_sel@2x.png';
                    }
                } else if (makerecordlist[i].flow_seq == 3) {
                    tmp3.push(makerecordlist[i])
                    if (makerecordlist[i].audit_user == "") {
                        tmp3[0].img = 'https://static.heys.com/wxapp/imgs/icon_handle_nor@2x.png';
                    } else {
                        tmp3[0].img = 'https://static.heys.com/wxapp/imgs/icon_handle_sel@2x.png';
                    }
                } else if (makerecordlist[i].flow_seq == 4) {
                    tmp4.push(makerecordlist[i])
                    if (makerecordlist[i].audit_user == "") {
                        tmp4[0].img = 'https://static.heys.com/wxapp/imgs/icon_check_nor@2x.png';
                    } else {
                        tmp4[0].img = 'https://static.heys.com/wxapp/imgs/icon_check_sel@2x.png';
                    }
                }
            }
            makerecordlist_now = [tmp1[0], tmp2[0], tmp3[0], tmp4[0]];
            var isShipped = false;
            var img = 'https://static.heys.com/wxapp/imgs/icon_delivery_nor@2x.png';
            if(status == 107 || status == 106){
                img = 'https://static.heys.com/wxapp/imgs/icon_delivery_sel@2x.png';
            }
            makerecordlist_now.push({
                flow_name: '已发货',
                img: img,
                is_background: 0,
                audit_date: dlvr_date
            })
            that.setData({
                makerecordlist: makerecordlist_now
            })
        } catch (e) {
            // Do something when catch error
        }
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