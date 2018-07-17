// var bmap = require('../../../utils/bmap-wx.js');
// var wxMarkerData = [];
// Page({
//     data: {
//         markers: [],
//         latitude: '',
//         longitude: '',
//         placeData: {},
//         count: 0, //附近助听器个数
//         showMap: false,
//         showDetail: false
//     },
//     makertap: function(e) {
//         var that = this;
//         var id = e.markerId;
//         that.showSearchInfo(wxMarkerData, id);
//         that.changeMarkerColor(wxMarkerData, id);
//         that.setData({
//             showDetail: true
//         })
//     },
//     toReady: function (){
//         var that = this;
//         // 新建百度地图对象
//         var BMap = new bmap.BMapWX({
//             ak: 'NKHsebLxHm9MM2GcWVXruaFnxXi3AkHX'
//         });
//         var fail = function(data) {
//             console.log(data)
//         };
//         var success = function(data) {
//             wxMarkerData = data.wxMarkerData;
//             that.setData({
//                 markers: wxMarkerData
//             });
//             that.setData({
//                 latitude: wxMarkerData[0].latitude
//             });
//             that.setData({
//                 longitude: wxMarkerData[0].longitude
//             });
//             that.setData({
//                 placeList: wxMarkerData,
//                 count: wxMarkerData.length
//             })
//         }
//         // 发起POI检索请求
//         BMap.search({
//             "query": '助听器',
//             fail: fail,
//             success: success,
//             // 此处需要在相应路径放置图片文件
//             iconPath: 'img/icon_point32@2x.png',
//             // 此处需要在相应路径放置图片文件
//             iconTapPath: 'img/icon_point32@2x.png'
//         });
//     },
//     onLoad: function() {
//        this.toReady()
//     },
//     showSearchInfo: function(data, i) {
//         var that = this;
//         that.setData({
//             placeData: {
//                 title:  data[i].title + '\n',
//                 address: '地址：' + data[i].address + '\n',
//                 telephone: '电话：' + data[i].telephone
//             }
//         });
//     },
//     changeMarkerColor: function(data, i) {
//         var that = this;
//         var markers = [];
//         for (var j = 0; j < data.length; j++) {
//             if (j == i) {
//                 // 此处需要在相应路径放置图片文件
//                 data[j].iconPath = "img/icon_point36choosed@2x.png";
//             } else {
//                 // 此处需要在相应路径放置图片文件
//                 data[j].iconPath = "img/icon_point32@2x.png";
//             }
//             // console.log(markers[j]);
//             // markers[j](data[j]);
//             markers[j] = data[j];
//         }
//         that.setData({
//             markers: markers
//         });
//     },
//     confirm:function (){
//         wx.redirectTo({
//             url: '/pages/index/index'
//         })
//     },
//     showMap:function (){
//         var t = this;
//         var showMap = t.data.showMap;
//         t.setData({
//             showMap: !showMap
//         })
//     },
//     fixedPosition:function (){
//         var t = this;
//         t.toReady()
//         t.setData({
//             showDetail: false
//         })
//     }
// })

var amapFile = require('../../../utils/amap-wx.js');
var markersData = [];
Page({
    data: {
        markers: [],
        latitude: '',
        longitude: '',
        textData: {},
        placeData: {},
        count: 0, //附近助听器个数
        showMap: false,
        showDetail: false
    },
    makertap: function(e) {
        var id = e.markerId;
        var that = this;
        that.showMarkerInfo(markersData,id);
        that.changeMarkerColor(markersData,id);
        that.setData({
            showDetail: true
        })
    },
    toReady: function (){
        var that = this;
        var myAmapFun = new amapFile.AMapWX({key:'d497f776997837715194e4a5bbe56589'});
        myAmapFun.getPoiAround({
            querykeywords: '助听器',
            iconPathSelected:  "img/icon_point32@2x.png", //如：..­/..­/img/marker_checked.png
            iconPath: "img/icon_point32@2x.png", //如：..­/..­/img/marker.png
            success: function(data){
                markersData = data.markers;
                console.log(data);
                for(var i = 0 ; i < markersData.length ; i ++){
                    markersData[i].width = 32;
                    markersData[i].height = 32;
                }
                that.setData({
                    markers: markersData
                });
                that.setData({
                    latitude: markersData[0].latitude
                });
                that.setData({
                    longitude: markersData[0].longitude
                });
                that.showMarkerInfo(markersData,0);
                that.setData({
                    placeList: markersData,
                    count: markersData.length
                })
            },
            fail: function(info){
                wx.showModal({title:info.errMsg})
            }
        })
    },
    onLoad: function() {
        this.toReady()
    },
    showMarkerInfo: function(data,i){
        var that = this;
        that.setData({
            textData: {
                name: data[i].name,
                desc: '地址：' + data[i].address
            }
        });
    },
    changeMarkerColor: function(data,i){
        var that = this;
        var markers = [];
        for(var j = 0; j < data.length; j++){
            if(j==i){
                data[j].iconPath =  "img/icon_point36choosed@2x.png"; //如：..­/..­/img/marker_checked.png
            }else{
                data[j].iconPath = "img/icon_point32@2x.png"; //如：..­/..­/img/marker.png
            }
            markers.push(data[j]);
        }
        that.setData({
            markers: markers
        });
    },
    fixedPosition:function (){
        var t = this;
        t.toReady()
        t.setData({
            showDetail: false
        })
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    confirm:function (){
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})