// about.js
Page({
    data: {},
    onLoad: function (options) {

    },
    goContact:function() {
        wx.navigateTo({
          url: '../contact/contact'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})