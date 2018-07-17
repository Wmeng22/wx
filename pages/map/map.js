var amapFile = require('../../utils/amap-wx.js');
Page({
  onLoad: function() {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({key:'d497f776997837715194e4a5bbe56589'});
    myAmapFun.getPoiAround({
      success: function(data){
        //成功回调
        console.log('success')
        console.log(data)
      },
      fail: function(info){
        //失败回调
        console.log('fail')
        console.log(info)
      }
    })
  },
})