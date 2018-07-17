var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        address: {},
        order_no: '',
        orderList: '',
        itemlist: '',
        ismetal: false,
        isLoading: false,
        tankuang: false,
        aliyun: '',
        price_pop: 0,
        addressList: [],
        isCorrect: false,
        promoCode: '',
        hasCoupon: false,
        kezi_content: '',
        remindUsers: false,
        SAVEs: true
    },
    onLoad: function (options) {
        var that = this;
        var info = wx.getStorageSync('info');
        var model = info.err.pty_list[8].pty_num;
        that.setData({
            model: model
        })
        var orderImg = '';
        if (info.aliyun) {
            orderImg = info.aliyun.replace('https://static.heygears.com/', '');
        } else {
            orderImg = options.aliyun
        }
        this.setData({
            aliyun: orderImg,
            addr_num: options.addr_num
        })
        app.login(function () {
            wx.hideLoading()
            wx.getStorage({
                key: 'uid',
                success: function (res) {
                    var uid = res.data;
                    that.setData({
                        uid: uid
                    })
                    wx.request({
                        url: globalData.apiURL + 'ucenter/address/default/' + uid,
                        success: function (res) {
                            var res = res.data;
                            if (res.success) {
                                that.setData({
                                    addressList: res.data
                                })
                                try {
                                    var info = wx.getStorageSync('info');

                                    var price_info = wx.getStorageSync('price_info');
                                    price_info = sub(price_info)
                                    var price_info_line = wx.getStorageSync('price_info_line');
                                    var price_info_peijian = wx.getStorageSync('price_info_peijian');
                                    var price_info_fenpin = wx.getStorageSync('price_info_fenpin');
                                    var price_info_model = wx.getStorageSync('price_info_model');

                                    function sub(list) {
                                        for (var i = 0; i < list.length; i++) {
                                            list[i].name_l = list[i].name_l.split('-')[1];
                                            list[i].name_r = list[i].name_r.split('-')[1];
                                        }
                                        return list
                                    }

                                    var kezi_content = '';
                                    if (info.err.pty_list[5] != -1) {
                                        kezi_content = info.err.pty_list[5].pty_val
                                    }
                                    that.setData({
                                        isLoading: true,
                                        info: info,
                                        price_info: price_info,
                                        price_info_line: price_info_line,
                                        price_info_peijian: price_info_peijian,
                                        price_info_fenpin: price_info_fenpin,
                                        price_info_model: price_info_model,
                                        kezi_content: kezi_content,
                                        kezi_color: info.kezi_color,
                                        kezi_price: info.kezi_price,
                                        model: info.err.pty_list[8].pty_num
                                    })
                                    that.getTotalPrice();
                                } catch (e) {

                                }
                            }
                        }
                    })
                }
            })
        })
    },
    doExit: function () {
        this.setData({
            popUp: true,
            pop_content: '是否保存当前设计'
        })
    },
    //保存设计
    confirmAction: function () {
        var t = this;
        // t.setStorage_zr();
        if(t.data.SAVEs){
            t.setData({
                SAVEs: false
            })
            var aliyun = t.data.aliyun;
            var info = wx.getStorageSync('info');
            if (info.peijian) { //配件
                for (var i = 0; i < info.peijian.length; i++) {
                    info.peijian[i].is_comb = 0;
                }
                // pushTpm(total_pty_list,info.peijian);
            }
            app.login(function () {
                wx.getStorage({
                    key: 'uid',
                    success: function (res) {
                        var uid = res.data;
                        app.take_token(function (token) {
                            var token = token;
                            var pty_list = info.err.pty_list;
                            var model = 0;//公
                            var designinfolist = [];
                            var prodlist = [];
                            if (pty_list[8].pty_num == 'PRIVATEMODEL') {
                                model = 1
                            }
                            for (var i = 0; i < pty_list.length; i++) {
                                if (pty_list[i] != -1) {
                                    var obj = {}
                                    obj.property_number = pty_list[i].pty_num;
                                    obj.property_value = pty_list[i].pty_val;
                                    designinfolist.push(obj)
                                }
                            }
                            for (var i = 0; i < info.line.length; i++) {
                                var obj = {}
                                obj.skuid = info.line[i].skuid;
                                obj.quantity = info.line[i].quantity;
                                obj.isfirst = info.line[i].is_comb;
                                prodlist.push(obj)
                            }
                            if (info.peijian) {
                                for (var i = 0; i < info.peijian.length; i++) {
                                    var obj = {}
                                    obj.skuid = info.peijian[i].skuid;
                                    obj.quantity = info.peijian[i].quantity;
                                    obj.isfirst = info.peijian[i].is_comb;
                                    prodlist.push(obj)
                                }
                            }
                            if (info.design_id) { //更新设计
                                wx.request({
                                    url: globalData.apiURL + 'trading/design',
                                    method: 'PUT',
                                    data: {
                                        token: token,
                                        uid: uid,
                                        skuid: info.err.skuid,
                                        design_name: info.err.ear_name,
                                        // design_imgurl:  'https://static.heygears.com/'  + aliyunTpm,
                                        design_imgurl: 'https://static.heygears.com/' + aliyun,
                                        design_id: info.design_id,
                                        // design_imgurl:  'https://static.heygears.com/'  + aliyun.replace('http://', ''),
                                        model_isprivate: model,
                                        design_status: 1,   //设计完成
                                        designinfolist: designinfolist,
                                        prodlist: prodlist,
                                    },
                                    success: function (res) {
                                        if (res.data.success) {
                                            wx.reLaunch({
                                                url: '/pages/index/index'
                                            })
                                        }
                                    }
                                })
                            } else { //提交设计
                                wx.request({
                                    url: globalData.apiURL + 'trading/design',
                                    method: 'POST',
                                    data: {
                                        token: token,
                                        uid: uid,
                                        skuid: info.err.skuid,
                                        design_name: info.err.ear_name,
                                        // design_imgurl:  'https://static.heygears.com/'  + aliyunTpm,
                                        design_imgurl: 'https://static.heygears.com/' + aliyun,
                                        // design_imgurl:  'https://static.heygears.com/'  + aliyun.replace('http://', ''),
                                        model_isprivate: model,
                                        design_status: 1, //设计完成
                                        designinfolist: designinfolist,
                                        prodlist: prodlist,
                                    },
                                    success: function (res) {
                                        t.setData({
                                            SAVEs: true
                                        })
                                        if (res.data.success) {
                                            wx.reLaunch({
                                                url: '/pages/index/index'
                                            })
                                        }
                                    }
                                })
                            }

                        })
                    }
                })
            })
        }

    },
    //不保存设计
    cancelAction: function () {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    getTotalPrice: function () {//从缓存里取价格
        var t = this;
        var toTalPrice = 0;
        var price_info = t.data.price_info;
        var price_info_line = t.data.price_info_line;
        var price_info_peijian = t.data.price_info_peijian;
        var price_info_fenpin = t.data.price_info_fenpin;
        var price_info_model = t.data.price_info_model;
        for (var item in price_info_peijian) {
            toTalPrice += getTotal(price_info_peijian[item])
        }
        toTalPrice += getTotal(price_info);
        toTalPrice += getTotal(price_info_line);
        toTalPrice += getTotal(price_info_fenpin);
        toTalPrice += getTotal(price_info_model);

        function getTotal(list) {
            var total = 0;
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    total += list[i].price * 1;
                }
            }
            return total;
        }

        t.setData({
            price_pop: toTalPrice.toFixed(2)
        })
    },
    toPay: function () {
        var that = this;
        if (that.data.isLoading) {
            //耳机
            var coupon = that.data.promoCode;
            if (coupon.length > 0 || app.trim(coupon) != '') { //有优惠码
                // that.check_promoCode(function (){
                wx.request({
                    url: globalData.apiURL + 'trading/coupon/' + coupon,
                    success: function (res) {
                        var res = res.data;
                        if (res.success) {
                            if (that.data.model == 'PRIVATEMODEL') { //私模的话需要加多个弹窗
                                that.setData({
                                    remindUsers: true
                                })
                            } else {
                                that.toSubmit();
                            }

                        } else {
                            that.setData({
                                err_tip: true
                            })
                            clearTimeout(that.data.setTimeout_time);
                            that.data.setTimeout_time = setTimeout(function () {
                                that.setData({
                                    err_tip: false,
                                })
                            }, 2000)
                        }
                    }
                })
                // });
            } else {          //没有优惠码
                // if(that.data.model == 'PRIVATEMODEL'){ //私模的话需要加多个弹窗
                //     that.setData({
                //         remindUsers: true
                //     })
                // }else{
                //     that.toSubmit();
                // }
                that.setData({
                    err_tip: true
                })
                clearTimeout(that.data.setTimeout_time);
                that.data.setTimeout_time = setTimeout(function () {
                    that.setData({
                        err_tip: false,
                    })
                }, 2000)
            }
        }
    },
    toSubmit: function () {
        var that = this;
        var info = that.data.info;
        var addr_num = that.data.addr_num;
        var aliyun = that.data.aliyun;
        var total_pty_list = [];

        /* 耳机属性 start*/
        var pty_list = info.err.pty_list
        for (var i = 0; i < pty_list.length; i++) {
            if (pty_list[i] == -1) {
                pty_list.splice(i, 1)
            }
        }
        info.err.pty_list = pty_list;
        info.err.lit_img = 'https://static.heygears.com/' + aliyun
        total_pty_list.push(info.err);
        /* 耳机属性 end*/
        /* 耳机配件 start*/
        var pid = info.err.pid;
        if (info.line) { //耳机线
            pushTpm(total_pty_list, info.line)
        }
        var hasDedaultSai = false;
        if (info.peijian) { //配件
            for (var i = 0; i < info.peijian.length; i++) {
                info.peijian[i].is_comb = 0;
            }
            pushTpm(total_pty_list, info.peijian);
        }
        function pushTpm(total_pty_list, list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if(that.data.model != "PRIVATEMODEL"){
                        if(list[i].skuid == '6f34ad8427d74952aa01cb00dbdffd9b'){ //有选中过黑色耳塞
                            list[i].is_comb = 1;
                            list[i].quantity++;
                            hasDedaultSai = true
                        }
                    }
                    var tpm = {
                        pid: list[i].access_prodid,
                        skuid: list[i].skuid,
                        quantity: list[i].quantity,
                        is_comb: list[i].is_comb, //0配件
                        ear_name: "",
                        lit_img: "",
                        pty_list: ""
                    }
                    total_pty_list.push(tpm)
                }
            }
        }
        /* 耳机配件 end*/
        /* 默认的黑色耳塞 start*/
        if(that.data.model != "PRIVATEMODEL"){
            if(!hasDedaultSai){ //如果没有选中默认耳塞
                total_pty_list.push({
                    pid: '10020',
                    skuid: '6f34ad8427d74952aa01cb00dbdffd9b',
                    quantity: 1,
                    is_comb: 1,//1默认
                    ear_name: "",
                    lit_img: "",
                    pty_list: ""
                })
            }
        }
        /* 默认的黑色耳塞 end*/
        var source = wx.getStorageSync('scene');
        if (source == 'undefined') {
            source = ''
        }
        app.login(function () {
            wx.getStorage({
                key: 'uid',
                success: function (res) {
                    var uid = res.data;
                    app.take_token(function (token) {
                        var token = token;
                        wx.request({
                            url: globalData.apiURL + 'trading/order/submit/custom',
                            method: 'POST',
                            data: {
                                token: token,
                                uid: uid,
                                product_id: pid,
                                source: source,
                                address_id: addr_num,
                                is_invc: 0,
                                invc_type: 1,
                                invc_title: '',
                                invc_taxnum: '',
                                iswechatqr: 0,
                                invc_email: '',
                                coupon: that.data.promoCode,
                                product_list: total_pty_list
                            },
                            success: function (res) {
                                var res = res.data;
                                if (res.success) {
                                    var order_no = res.data.order_no;
                                    var design_id = that.data.info.design_id;
                                    var status = res.data.status;
                                    if(design_id){
                                        app.login(function () {
                                            wx.getStorage({
                                                key: 'uid',
                                                success: function (res) {
                                                    var uid = res.data;
                                                    app.take_token(function (token) {
                                                        var token = token;
                                                        wx.request({
                                                            url:  globalData.apiURL + 'trading/design',
                                                            method: 'DELETE',
                                                            data: {
                                                                token: token,
                                                                uid: uid,
                                                                design_id: design_id
                                                            },
                                                            success: function (res) {
                                                                var res = res.data;
                                                                if(res.success){ //删除成功
                                                                    wx.hideLoading()
                                                                    if (status == 102) {
                                                                        wx.reLaunch({
                                                                            url: '/pages/toPay/pay_success/pay_success?order_no=' + order_no
                                                                        })
                                                                    } else {
                                                                        console.log('下单成功');
                                                                        wx.reLaunch({
                                                                            url: 'weixin_pay/weixin_pay?order_no=' + order_no
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    }else{
                                        wx.hideLoading()
                                        if (status == 102) {
                                            wx.reLaunch({
                                                url: '/pages/toPay/pay_success/pay_success?order_no=' + order_no
                                            })
                                        } else {
                                            console.log('下单成功');
                                            wx.reLaunch({
                                                url: 'weixin_pay/weixin_pay?order_no=' + order_no
                                            })
                                        }
                                    }
                                }
                            }
                        })
                    })
                }
            })
        })
    },
    inputCode: function () {
        var that = this;
        wx.scanCode({
            success: function (res) {
                var promoCode = app.trim(res.result);
                that.setData({
                    promoCode: promoCode
                })
                that.check_promoCode();
            }

        })
    },
    inputCode2: function (e) {
        var promoCode = app.trim(e.detail.value)
        this.setData({
            promoCode: promoCode
        })
        this.check_promoCode();
    },
    check_promoCode: function (cb) {
        var that = this;
        var promoCode = this.data.promoCode;
        // if(app.trim(promoCode) == ''){
        //     that.setData({
        //         hasCoupon:false
        //     })
        // }else{
        wx.request({
            url: globalData.apiURL + 'trading/coupon/' + promoCode,
            success: function (res) {
                var res = res.data;
                if (res.success) {
                    that.setData({
                        isWrong: false,
                        isCorrect: true,
                        hasCoupon: true
                    })
                } else {
                    that.setData({
                        isWrong: true,
                        isCorrect: false,
                        hasCoupon: false
                    })

                }
            }
        })
        // }

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})