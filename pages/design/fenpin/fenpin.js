var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        prolist: [], //产品列表
        active: 0,
        active_sub: 0,
        showDetail: true,
        circular: true,
        duration: 500,
        currentTab: -1,
        animationData: {},
        btnContent:'查看详情',
        fenpinArr:[]
    },
    onLoad: function (options) {
        var t = this;
        try {
            var info = wx.getStorageSync('info');
            var pid = 10014;
            var hasFP = false;
            if (info) {
                pid = info.err.pid
                /* ***可预订的产品（10014/10015）*** */
                // if (info.err.pty_list.fenpin) {
                hasFP = true
                // }
            } else {
                info = false;
            }
            t.setData({
                info: info,
                pid: pid
            })
            wx.request({
                url: globalData.apiURL + 'goods/product/lit-app/presell',
                success: function (res) {
                    var prolist = res.data.data.prolist;
                    for (var i = 0; i < prolist.length; i++) {

                        if (prolist[i].product_id == pid) {
                            t.setData({
                                active: i
                            })
                        }
                        var arr = [];
                        (function (i) {
                            wx.request({
                                url: globalData.apiURL + 'goods/product/lit-app/info/' + prolist[i].product_id + '?ismetal=false',
                                success: function (res) {
                                    var baseitemlist = res.data.data.baseitemlist;
                                    for (var j = 0; j < baseitemlist.length; j++) {
                                        if (baseitemlist[j].item_number == 110) { //分频
                                            prolist[i].product_name = prolist[i].product_name.toUpperCase().split(' ');
                                            prolist[i].ptylist = baseitemlist[j].ptylist;
                                            for(var m = 0 ; m < prolist[i].ptylist.length ; m ++){
                                                prolist[i].ptylist[m].property_des =  prolist[i].ptylist[m].property_des.split('|')
                                                prolist[i].ptylist[m].pid = prolist[i].product_id
                                                prolist[i].ptylist[m].idx = i;
                                                prolist[i].ptylist[m].subidx = m;
                                                prolist[i].ptylist[m].sale_price = prolist[i].sale_price;
                                                prolist[i].ptylist[m].product_name = prolist[i].product_name

                                                arr.push(prolist[i].ptylist[m])
                                            }
                                            prolist[i].ptylist = baseitemlist[j].ptylist;
                                            if (hasFP) {
                                                for (var k = 0; k < baseitemlist[j].ptylist.length; k++) {
                                                    if (baseitemlist[j].ptylist[k].property_number == info.err.pty_list[0].pty_num) {
                                                        t.setData({
                                                            active_sub: k
                                                        })
                                                        // console.log(k);
                                                    }
                                                }
                                            }
                                            t.setData({
                                                prolist: prolist
                                            })
                                            // console.log(prolist);
                                        }
                                        else if(baseitemlist[j].item_number == 113){   //公私模
                                            for(var m = 0 ; m < baseitemlist[j].ptylist.length ; m ++){
                                                if(baseitemlist[j].ptylist[m].property_number == 'PUBLICMODEL'){
                                                    // console.log(baseitemlist[j].ptylist[m].property_price);
                                                    t.setData({
                                                        modelPrice: baseitemlist[j].ptylist[m].property_price
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    console.log(arr);
                                    t.setData({
                                        fenpinArr:arr
                                    })
                                }
                            })
                        })(i)
                    }
                }
            })
        } catch (e) {
                console.log(e);
        }

    },
    // 选择分频
    choose_fenpin: function (e) {
        var t = this;
        var e = e.currentTarget.dataset;
        var idx = e.idx;
        var subidx = e.subidx;
        var pid = e.pid;
        var fenpinArr =  t.data.fenpinArr
        for(var i = 0 ; i < fenpinArr.length ; i ++){
            if(fenpinArr[i].idx == idx && fenpinArr[i].subidx ==subidx){
                t.setData({
                    currentTab: i
                })
            }
        }
        t.setData({
            active: idx,
            active_sub: subidx,
            pid: pid
        })
    },
    // 下一步
    goNext: function () {
        var t = this;
        if (t.data.btnContent == '查看详情'){
            if(t.data.currentTab == -1){
                t.setData({
                    currentTab: 0
                })
            }
            var animation = wx.createAnimation({
                duration: 500,
                timingFunction: "ease-out",
                delay: 0
            })
            var windowHeight = 0;
            wx.getSystemInfo({
                success: function(res) {
                    console.log(res.windowHeight)
                    windowHeight = res.windowHeight;
                }
            })
            // var moveDis = 55/1216*windowHeight;
            // var h = 1032/1216*windowHeight;
            // console.log(moveDis+h + '下来');
            // animation.height(moveDis+h).step();
            var moveDis = 1050/1216*windowHeight;
            animation.height(moveDis).step();
            this.setData({
                animationData: animation.export(),
            })
            t.setData({
                btnContent: '确认选择'
            })
        }else{
            var idx = t.data.active;
            var subidx = t.data.active_sub;
            var theProlist = t.data.prolist[idx];
            // console.log(theProlist);
            var info = t.data.info;
            var pty_list = [];
            var model = '';
            var modelName = '';
            var fenpin = [{
                name: theProlist.ptylist[subidx].property_name,
                price: theProlist.sale_price*1 + theProlist.ptylist[subidx].property_price*1
            }];
            // var model = [{
            //     name: theProlist.ptylist[subidx].property_name,
            //     price: theProlist.sale_price*1 + theProlist.ptylist[subidx].property_price*1
            // }];
            if (info && theProlist.product_id == info.err.pid) {
                pty_list = info.err.pty_list;
                if(info.err.pty_list[8]){
                    model = info.err.pty_list[8].pty_num;
                }else{
                    model = 'PUBLICMODEL'; //默认为公模
                }
            } else {  //用户第一次进入分频
                info = {};
                model = 'PUBLICMODEL'; //默认为公模
            }
            pty_list[0] = {
                pty_num: theProlist.ptylist[subidx].property_number,
                pty_val: ''
            }
            pty_list[8] = {
                pty_num: model,
                pty_val: ''
            }
            if(info.err==undefined){
                info.err = {}
            }
            info.err.pid = theProlist.product_id;
            info.err.skuid = theProlist.skuid;
            info.err.is_comb = 1;
            info.err.quantity = 1;
            info.err.pty_list = pty_list;
            if(model == 'PRIVATEMODEL'){
                modelName = '私模'
            }else{
                modelName = '公模'
            }
            var price_model = [{
                name: modelName,
                price: t.data.modelPrice
            }];
            wx.setStorageSync('info', info);
            wx.setStorageSync('price_info_fenpin', fenpin);
            wx.setStorageSync('price_info_model', price_model);
            if (t.data.pid == 10014) {    //syren
                // wx.redirectTo({
                //     url: '../named/named'
                // })
                wx.redirectTo({
                    url: '../tutorial/tutorial?model=' + model
                })
            } else if (t.data.pid == 10015) { //syren pro
                wx.redirectTo({
                    url: '../model/model'
                })
            }
        }

    },
    goPre: function () {
        var t = this;
        wx.redirectTo({
            url: '../../index/index'
        })
    },
    openQuestion: function (){
        var t = this;
        t.setData({
            showQuestion: true
        })
    },
    remove_question_fade: function (){
        var t = this;
        t.setData({
            showQuestion: false
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //向前切换轮播图
    preCurrent: function (){
        var t = this;
        var currentTab = t.data.currentTab;
        if(currentTab > 0){
            currentTab --;
        }else{
            currentTab = t.data.fenpinArr.length -1
        }
        console.log(currentTab);
        t.setData({
            currentTab: currentTab
        })
    },
    //向后切换轮播图
    nextCurrent: function (){
        var t = this;
        var currentTab = t.data.currentTab;
        if(currentTab < t.data.fenpinArr.length - 1){
            currentTab ++;
        }else{
            currentTab = 0
        }
        console.log(currentTab);
        t.setData({
            currentTab: currentTab
        })
    },
    swiperChange:function (e){
        console.log(e.detail);
        var t = this;
        var current = e.detail.current;
        var idx = t.data.fenpinArr[current].idx;
        var subidx = t.data.fenpinArr[current].subidx;
        var pid = t.data.fenpinArr[current].pid;
        t.setData({
            active: idx,
            active_sub: subidx,
            pid: pid,
            currentTab: current
        })
    },
    //收起
    closeDetail:function (){
        var animation = wx.createAnimation({
            // transformOrigin:50% 50%,
            duration: 500,
            timingFunction: "ease-out",
            delay: 0
        })
        var windowHeight = 0;
        wx.getSystemInfo({
            success: function(res) {
                console.log(res.windowHeight)
                windowHeight = res.windowHeight;
            }
        })
        // var moveDis = 1050/1216*windowHeight;
        // console.log(moveDis + '上去');
        // animation.translateY(-moveDis).step();


        animation.height(0).step();
        this.setData({
            animationData: animation.export(),
            btnContent: '查看详情'
        })
    }
})