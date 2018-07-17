var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        ptylist: [],
        active: 0,
        isAgreed: false, //是否已经同意
        ready: false,
        flag: true,
        showTreaty: false,
        showQuestion: false
    },
    onLoad: function (options) {
        var t = this;
        //从缓存中获取pid
        var pid = 10015;
        var ptylist = [];
        try {
            var info = wx.getStorageSync('info');
            var price_info_fenpin = wx.getStorageSync('price_info_fenpin');
            var fenpinPrice = price_info_fenpin[0].price;
            t.setData({
                fenpinPrice:fenpinPrice
            })
            var model = 'PUBLICMODEL';
            var active = 0;
            var isAgreed = false;
            if (info) {
                if(info.err.pty_list[8]){
                    model = info.err.pty_list[8].pty_num;
                }
                if (info.isAgreed) {
                    isAgreed = true;
                }
                // console.log('111');
                wx.request({
                    url: globalData.apiURL + 'goods/product/lit-app/info/' + pid + '?ismetal=false',
                    success: function (res) {
                        var baseitemlist = res.data.data.baseitemlist;
                        for (var j = 0; j < baseitemlist.length; j++) {
                            if (baseitemlist[j].item_number == 113) {
                                ptylist = baseitemlist[j].ptylist;
                                for (var i = 0; i < ptylist.length; i++) {
                                    if (ptylist[i].property_number == 'PUBLICMODEL') {
                                        ptylist[i].property_name = ['标准版']
                                    } else if (ptylist[i].property_number == 'PRIVATEMODEL') {
                                        ptylist[i].property_name = ['CIEMs', '私模定制版']
                                    }
                                    if (ptylist[i].property_number == model) {
                                        active = i;
                                    }
                                    ptylist[i].property_des = ptylist[i].property_des.split('|')
                                }
                                t.setData({
                                    active:active,
                                    ready: true,
                                    info: info,
                                    model: model,
                                    ptylist: ptylist,
                                    isAgreed: isAgreed
                                })
                            }
                        }
                    }
                })
            } else {

            }
        } catch (e) {
            console.log(e);
        }

    },
    // 选择模型
    chooseModel: function (e) {
        var t = this;
        if (t.data.ready) {
            var e = e.currentTarget.dataset
            var model = e.model;
            var modelprice = e.price;
            var active = e.idx;
            t.setData({
                model: model,
                active: active,
                modelprice:modelprice
            })
            // console.log(model);
        }

    },
    // 下一步
    goNext: function () {
        var t = this;
        if (t.data.ready) {
            var info = t.data.info;
            // console.log(t.data.isAgreed);
            if(t.data.model == 'PUBLICMODEL'){
                if(info.err.pty_list[8]){
                    info.err.pty_list[8].pty_num = t.data.model;
                }else{
                    info.err.pty_list[8] = {
                        pty_num:  t.data.model,
                        pty_val: ''
                    }
                }
                var price_model = [{
                    name: '公模',
                    price: t.data.ptylist[0].property_price
                }];
                // info.isAgreed = true;
                wx.setStorageSync('info', info);
                wx.setStorageSync('price_info_model', price_model);
                wx.redirectTo({
                    url: '../named/named'
                })
            }else{
                t.setData({
                    showTreaty: true
                })
                if (!t.data.isAgreed) {   //没有签署条款
                    t.setData({
                        flag: false
                    })
                }
                else{
                    if(info.err.pty_list[8]){
                        info.err.pty_list[8].pty_num = t.data.model;
                    }else{
                        info.err.pty_list[8] = {
                            pty_num:  t.data.model,
                            pty_val: ''
                        }
                    }
                    info.isAgreed = true;
                    var price_model = [{
                        name: '私模',
                        price:  t.data.ptylist[1].property_price
                    }];
                    wx.setStorageSync('info', info);
                    wx.setStorageSync('price_info_model', price_model);
                    wx.redirectTo({
                        url: '../tutorial/tutorial?model=' + 'PRIVATEMODEL'
                    })
                    // wx.redirectTo({
                    //     url: '../named/named'
                    // })
                }
            }

            // console.log(t.data.model);
        }

    },
    // 上一步
    cancel:function (){
        var t = this;
        if(t.data.showTreaty){
            t.setData({
                showTreaty: false,
                flag:true
            })
        }else{
            wx.redirectTo({
                url: '../fenpin/fenpin'
            })
        }
    },
    // 同意条款
    toAgree: function () {
        var t = this;
        var isAgreed = !t.data.isAgreed;
        t.setData({
            flag: isAgreed,
            isAgreed: isAgreed,
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
})