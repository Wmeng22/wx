var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        errName: '',//耳机名字
        errorTip: '',//错误提示内容
        errorTipShow: false,//是否显示错误提示
        tipIcon: '',//提示icon
        flag: false,//是否可以跳到下一页
        array: [[1, 2], [3, 4], [5, 6], [7, 8], [9]],
        recommendList: [],   //官方设计
        active:0,
        ready: false,
        first: -1,
        second: -1
    },
    onLoad: function (options) {
        var t = this;
        t.setData({
            first: -1,
            second: -1
        })
        try {
            var info = wx.getStorageSync('info');
            var fenpinNum = '';
            var model_isprivate = 0;
            if (info) {
                var errName = info.err.ear_name;
                fenpinNum = info.err.pty_list[0].pty_num;
                if(info.err.pty_list[8].pty_num == 'PRIVATEMODEL'){
                    model_isprivate = 1;
                }
                t.setData({
                    pid: info.err.pid,
                    skuid: info.err.skuid
                })
                if(errName == undefined){
                    errName = ''
                }else{
                    t.setData({
                        errName: errName
                    })
                    t.nameInput()
                }

            } else {

            }
            //官方推荐（目前去掉）

            // wx.request({
            //     url: globalData.apiURL + 'trading/design/recommend/list?skuid=' + t.data.skuid + '&pty_number=' + fenpinNum + '&model_isprivate=' + model_isprivate,
            //     success: function (res) {
            //         var res = res.data;
            //         if(res.success){
            //             var recommendList = res.data;
            //             var arr = []
            //             for(var i = 0 ; i < recommendList.length ; i++){
            //                 var totalPrice = 0;
            //                 for(var j = 0 ; j < recommendList[i].ptylist.length ; j ++){
            //                     totalPrice += recommendList[i].ptylist[j].property_price *1;
            //                 }
            //                 for(var k = 0 ; k < recommendList[i].prodlist.length ; k ++){
            //                     if(recommendList[i].prodlist[k].isfirst==1){
            //                         totalPrice += recommendList[i].prodlist[k].comb_price*1
            //                     }else{
            //                         totalPrice += recommendList[i].prodlist[k].sale_price*1
            //                     }
            //                 }
            //                 totalPrice += recommendList[i].sale_price *1;
            //                 recommendList[i].sale_price = totalPrice;
            //                 var int = parseInt(i/2)
            //                 if(arr[int] == undefined){
            //                     arr[int] = []
            //                 }
            //                 arr[int].push(recommendList[i]);
            //
            //             }
            //             console.log(arr);
            //             t.setData({
            //                 recommendList: arr,
            //                 ready: true
            //             })
            //         }
            //     }
            // })
        } catch (e) {

        }
    },
    onShow:function (){
        var t = this;
        t.setData({
            first: -1,
            second: -1
        })
    },
    // 输入耳机命名，不能为空且最多为10个字符
    nameInput: function (e) {
        var t = this;
        var value = app.trim(t.data.errName);
        // console.log(value);

        if (e) {
            // console.log('进来了');
            value = app.trim(e.detail.value);
        }
        t.setData({
            errName: value
        })
        var len = app.StringLen(value);
        if (len > 0 && !app.check_name(value)) { //如果输入特殊符号
            t.setData({
                errorTip: '昵称不能带有特殊符号',
                errorTipShow: true,
                flag: false
            })
        } else if (len > 10) {                    //如果输入的过长
            t.setData({
                errorTip: '您输入的字符过长，请在5个中文或10个英文字符以下',
                errorTipShow: true,
                flag: false
            })
        } else if (len === 0) {                    //如果为空
            t.setData({
                errorTip: '昵称不能为空',
                errorTipShow: true,
                flag: false
            })
        } else {
            t.setData({
                errorTip: '',
                errorTipShow: false,
                flag: true,
                errName: value
            })
        }
    },
    goNext: function () {
        var t = this;
        if(t.data.flag){
            try {
                var info = wx.getStorageSync('info');
                var ear_name = t.data.errName
                if (info) {
                    info.err.ear_name = ear_name;
                    if(t.data.first !=-1 && t.data.second !=-1){ //选了官方推荐
                        var recommend = t.data.recommendList[t.data.first][t.data.second]//object
                        var pty_list = [];
                        var hasKezi = false;
                        for(var i = 0 ; i < recommend.ptylist.length ; i ++){
                            var thePtylist = recommend.ptylist[i];
                            //分频
                            if(thePtylist.item_number == 110){
                                pty_list[0] = {};
                                pty_list[0].pty_num = thePtylist.property_number
                                pty_list[0].pty_val = ''
                            }
                            //左机身
                            else if(thePtylist.item_number == 105 && thePtylist.ear_mark == 1){
                                pty_list[1] = {};
                                pty_list[1].pty_num = thePtylist.property_number
                                pty_list[1].pty_val = ''
                            }
                            //右机身
                            else if(thePtylist.item_number == 105 && thePtylist.ear_mark == 2){
                                pty_list[2] = {};
                                pty_list[2].pty_num = thePtylist.property_number
                                pty_list[2].pty_val = ''
                            }
                            //左面板
                            else if(thePtylist.item_number == 106 && thePtylist.ear_mark == 1){
                                pty_list[3] = {};
                                pty_list[3].pty_num = thePtylist.property_number
                                pty_list[3].pty_val = ''
                            }
                            //右面板
                            else if(thePtylist.item_number == 106 && thePtylist.ear_mark == 2){
                                pty_list[4] = {};
                                pty_list[4].pty_num = thePtylist.property_number
                                pty_list[4].pty_val = ''
                            }
                            //左刻字
                            else if(thePtylist.item_number == 109 ){
                                hasKezi = true;
                                pty_list[5] = {};
                                pty_list[5].pty_num = thePtylist.property_number
                                pty_list[5].pty_val = thePtylist.property_value
                            }
                            //左logo
                            else if(thePtylist.item_number == 114 && thePtylist.ear_mark == 1){
                                pty_list[7] = {};
                                pty_list[7].pty_num = thePtylist.property_number
                                pty_list[7].pty_val = ''
                            }
                            //右logo
                            else if(thePtylist.item_number == 114 && thePtylist.ear_mark == 2){
                                pty_list[6] = {};
                                pty_list[6].pty_num = thePtylist.property_number
                                pty_list[6].pty_val = ''
                            }
                            //公模私模
                            else if(thePtylist.item_number == 113 ){
                                pty_list[8] = {};
                                pty_list[8].pty_num = thePtylist.property_number
                                pty_list[8].pty_val = ''
                            }
                        }
                        if(hasKezi){
                            pty_list[7] = -1;
                        }else{
                            pty_list[5] = -1;
                        }
                        //耳机属性
                        // console.log(recommend);
                        info.err = {
                            pid: recommend.product_id,
                            skuid: recommend.skuid,
                            is_comb:1,
                            quantity: 1,
                            pty_list: pty_list,
                            ear_name:ear_name
                        }
                        info.hasDesign = true
                        // console.log(info.err);
                        //耳机配件
                        var lineList = []
                        var peijianList = [];
                        for(var i = 0 ; i < recommend.prodlist.length ; i ++){
                            var theProdlist = recommend.prodlist[i]
                            if(theProdlist.prod_cid == 10201){  //线
                                lineList.push({
                                    skuid: theProdlist.skuid,
                                    is_comb: theProdlist.isfirst,
                                    quantity: theProdlist.quantity,
                                    access_prodid: theProdlist.prod_cid
                                })
                            }else{
                                if(theProdlist.prod_cid == 10203 && theProdlist.isfirst == 1){

                                }else{
                                    peijianList.push({
                                        skuid: theProdlist.skuid,
                                        is_comb: theProdlist.isfirst,
                                        quantity: theProdlist.quantity,
                                        category_id: theProdlist.prod_cid
                                    })
                                }
                            }
                        }
                        info.line = lineList;
                        info.peijian = peijianList;
                    }
                    wx.setStorageSync('info', info);
                    wx.redirectTo({
                        url: '../design'
                    })
                }
            } catch (e) {

            }
        }
    },
    goPre: function () {
        var t = this;
        try {
            var info = wx.getStorageSync('info');
            if (info) {
                info.err.ear_name = t.data.errName
                var pid = info.err.pid;
                wx.setStorageSync('info', info);
                if(pid==10014){
                    wx.redirectTo({
                        url: '../fenpin/fenpin'
                    })
                }else if(pid==10015){
                    wx.redirectTo({
                        url: '../model/model'
                    })
                }

            }
        } catch (e) {

        }
    },
    // 选择官方推荐
    chooseRecommend: function (e) {
        var t = this;
        var dataset = e.currentTarget.dataset;
        var idx = dataset.idx;
        var subIdx = dataset.subidx;
        if(idx == t.data.first && subIdx == t.data.second){ //取消选择
            idx = -1;
            subIdx = -1;
        }
        t.setData({
            first: idx,
            second: subIdx
        })
    },
    // 滑动
    swiperChange: function (e) {
        var current = e.detail.current;
        this.setData({
            active: current,
            i: current,
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})