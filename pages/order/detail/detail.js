var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        orderList: {},
        isLoading: false,
        order_no: '',
        status:''
    },
    onLoad: function (options) {
        var order_no = options.order_no;
        var kezi_color = options.kezi_color;
        var status = options.status;
        var keziContent = options.keziContent
        this.setData({
            order_no: order_no,
            kezi_color:kezi_color,
            status:status
        })
        var that = this;
        app.login(function () {
            wx.getStorage({
                key: 'uid',
                success: function (res) {
                    var uid = res.data;
                    if(status != '设计中' &&status != '设计完成' ){
                        wx.request({
                            url: globalData.apiURL + 'trading/order/get/custom/' + order_no + '?uid=' + uid,
                            success: function (res) {
                                var res = res.data;
                                var data = res.data;
                                if (res.success) {
                                    var ismetal = false;
                                    var metal = '';
                                    var orderList = res.data;
                                    try {
                                        wx.setStorageSync('makerecordlist', orderList.makerecordlist)
                                    } catch (e) {

                                    }
                                    var prodlist = orderList.prodlist;
                                    var baseitemlist = orderList.baseitemlist;
                                    var itemlist = orderList.itemlist;
                                    if (data.itemlist.length === 1) {//判断耳机是否为金属
                                        ismetal = true;
                                    }
                                    var promo = orderList.promo;
                                    var linePtylist = [];
                                    var cleanPtylist = [];
                                    var saiPtylist = [];
                                    var kouPtylist = [];
                                    var shouPtylist = [];
                                    var fenpinPtylist = [];
                                    var modelPtylist = [];
                                    var keziPtylist = [];
                                    var logoPtylist = [];
                                    var fuselagePtylist = [];
                                    var panelPtylist = [];
                                    var err = {};
                                    var kezi_content = '';
                                    for(var i = 0 ; i < prodlist.length ; i ++){
                                        if (prodlist[i].category_id == 10201) {//线材类
                                            var pty_name = prodlist[i].pty_name + ',';
                                            prodlist[i].pty_name = pty_name.split(",")[1];
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            linePtylist.push(prodlist[i]);
                                        }else if (prodlist[i].category_id == 10202) {//清洁类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            cleanPtylist.push(prodlist[i])
                                        }else if (prodlist[i].category_id == 10203) {//耳塞类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            saiPtylist.push(prodlist[i])
                                        }else if (prodlist[i].category_id == 10204) {//转接口类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            kouPtylist.push(prodlist[i])
                                        }else if (prodlist[i].category_id == 10205) {//收纳类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            shouPtylist.push(prodlist[i])
                                        }else if(prodlist[i].category_id == 10103){
                                            err = prodlist[i];
                                        }
                                    }
                                    for(var i = 0 ; i < baseitemlist.length ; i ++){
                                        if(baseitemlist[i].item_number == 110){//分频
                                            fenpinPtylist = baseitemlist[i].ptylist
                                        }
                                        else if(baseitemlist[i].item_number == 113){//模型
                                            modelPtylist = baseitemlist[i].ptylist
                                        }
                                    }
                                    for(var i = 0 ; i < itemlist.length ; i ++){
                                        if(itemlist[i].item_number == 109){//刻字
                                            keziPtylist.push(itemlist[i].leftPtylist[0].ptylist[0]);
                                            kezi_content = itemlist[i].leftPtylist[0].ptylist[0].property_value
                                        }else if(itemlist[i].item_number == 114){//logo
                                            logoPtylist.push(itemlist[i].rightPtylist[0].ptylist)
                                        }else if(itemlist[i].item_number == 105){//机身
                                            fuselagePtylist= [itemlist[i].leftPtylist[0],itemlist[i].rightPtylist[0]]
                                        }else if(itemlist[i].item_number == 106){//面板
                                            panelPtylist= [itemlist[i].leftPtylist[0],itemlist[i].rightPtylist[0]]
                                        }
                                    }
                                    that.setData({
                                        ismetal: ismetal,
                                        orderList: orderList,
                                        linePtylist: linePtylist,
                                        cleanPtylist: cleanPtylist,
                                        saiPtylist: saiPtylist,
                                        kouPtylist: kouPtylist,
                                        shouPtylist: shouPtylist,
                                        fenpinPtylist:fenpinPtylist,
                                        modelPtylist:modelPtylist,
                                        keziPtylist:keziPtylist,
                                        fuselagePtylist:fuselagePtylist,
                                        panelPtylist:panelPtylist,
                                        err: err,
                                        promo:promo,
                                        isLoading: true,
                                        kezi_content:kezi_content,
                                        status:status,
                                        dlvr_date:orderList.dlvr_date
                                    })
                                    wx.hideLoading();
                                }

                            }
                        })
                    }else{
                        wx.request({
                            url: globalData.apiURL + 'trading/design/' + order_no +'?uid=' + uid,
                            success: function (res) {
                                var res = res.data;
                                var data = res.data;
                                if (res.success) {
                                    var ismetal = false;
                                    var metal = '';
                                    var orderList = res.data;
                                    try {
                                        wx.setStorageSync('makerecordlist', orderList.makerecordlist)
                                    } catch (e) {

                                    }
                                    var prodlist = orderList.prodlist;
                                    // var baseitemlist = orderList.baseitemlist;
                                    var ptylist = orderList.ptylist
                                    // var itemlist = orderList.itemlist;
                                    // if (data.itemlist.length === 1) {//判断耳机是否为金属
                                    //     ismetal = true;
                                    // }
                                    // var promo = orderList.promo;
                                    var linePtylist = [];
                                    var cleanPtylist = [];
                                    var saiPtylist = [];
                                    var kouPtylist = [];
                                    var shouPtylist = [];
                                    var fenpinPtylist = [];
                                    var modelPtylist = [];
                                    var keziPtylist = [];
                                    var logoPtylist = [];
                                    var fuselagePtylist = [];
                                    var panelPtylist = [];
                                    var err = {};
                                    var kezi_content = keziContent;
                                    err.sku_litimg = orderList.design_imgurl;
                                    err.ear_nickname = orderList.design_name;
                                    for(var i = 0 ; i < prodlist.length ; i ++){
                                        if (prodlist[i].prod_cid == 10201) {//线材类
                                            var pty_name = prodlist[i].pty_name + ',';
                                            prodlist[i].pty_name = pty_name.split(",")[1];
                                            // if(prodlist[i].isfirst == 1){
                                                prodlist[i].sale_price = prodlist[i].sale_amt;
                                            // }
                                            linePtylist.push(prodlist[i]);
                                        }else if (prodlist[i].prod_cid == 10202) {//清洁类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            cleanPtylist.push(prodlist[i])
                                        }else if (prodlist[i].prod_cid == 10203) {//耳塞类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            // if(prodlist[i].isfirst == 1){
                                            //     prodlist[i].sale_price = prodlist[i].comb_price;
                                            // }
                                            saiPtylist.push(prodlist[i])
                                        }else if (prodlist[i].prod_cid == 10204) {//转接口类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            kouPtylist.push(prodlist[i])
                                        }else if (prodlist[i].prod_cid == 10205) {//收纳类
                                            prodlist[i].sale_price = prodlist[i].sale_amt;
                                            shouPtylist.push(prodlist[i])
                                        }
                                        // else if(prodlist[i].prod_cid == 10103){
                                        //     err = prodlist[i];
                                        // }
                                    }
                                    for(var i = 0 ; i < ptylist.length ; i ++){
                                        if(ptylist[i].item_number == 110){
                                            fenpinPtylist.push(ptylist[i])
                                        }
                                        else if(ptylist[i].item_number == 113){
                                            modelPtylist.push(ptylist[i])
                                        }
                                    }
                                    for(var i = 0 ; i < ptylist.length ; i ++){
                                        if(ptylist[i].item_number == 109){//刻字
                                            keziPtylist.push(ptylist[i]);
                                            // kezi_content = ptylist[i].leftPtylist[0].ptylist[0].property_value
                                        }else if(ptylist[i].item_number == 114){//logo
                                            logoPtylist.push(ptylist[i])
                                        }else if(ptylist[i].item_number == 105){ //机身
                                            if(ptylist[i].ear_mark == 1){   //左耳
                                                fuselagePtylist[0] = ptylist[i]
                                            }else{
                                                fuselagePtylist[1] = ptylist[i]
                                            }
                                        }else if(ptylist[i].item_number == 106){  //面板
                                            if(ptylist[i].ear_mark == 1){   //左耳
                                                panelPtylist[0] = ptylist[i]
                                            }else{
                                                panelPtylist[1] = ptylist[i]
                                            }
                                        }
                                    }

                                    orderList.order_amt = orderList.sale_price
                                    that.setData({
                                        ismetal: ismetal,
                                        orderList: orderList,
                                        linePtylist: linePtylist,
                                        cleanPtylist: cleanPtylist,
                                        saiPtylist: saiPtylist,
                                        kouPtylist: kouPtylist,
                                        shouPtylist: shouPtylist,
                                        fenpinPtylist:fenpinPtylist,
                                        modelPtylist:modelPtylist,
                                        keziPtylist:keziPtylist,
                                        fuselagePtylist:fuselagePtylist,
                                        panelPtylist:panelPtylist,
                                        err: err,
                                        // promo:promo,
                                        isLoading: true,
                                        kezi_content:kezi_content,
                                        status:orderList.status,
                                        dlvr_date:orderList.dlvr_date
                                    })

                                    var price_info_line  = peijianCount(linePtylist)
                                    var clean = peijianCount(cleanPtylist)
                                    var sai = peijianCount(saiPtylist)
                                    var kou = peijianCount(kouPtylist)
                                    var shou = peijianCount(shouPtylist)
                                    var price_info = [];
                                    price_info.push(fusePanel(fuselagePtylist,105))
                                    price_info.push(fusePanel(panelPtylist,106))
                                    if(keziPtylist.length > 0){
                                        price_info.push(fusePanel(keziPtylist,109))

                                    }

                                    function fusePanel(list,num){
                                        var name_l = '';
                                        var name_r = '';
                                        var price = 0;
                                        for(var i = 0 ; i < list.length ; i ++){
                                            if(num == 105){ //机身
                                                if(list[i].ear_mark == 1){
                                                        name_l =  '下壳 - ' + list[i].property_name,
                                                        price += list[i].property_price*1
                                                }else{
                                                        name_r =   '下壳 - ' + list[i].property_name,
                                                        price += list[i].property_price*1
                                                }
                                            }else if(num == 106){//面板
                                                if(list[i].ear_mark == 1){
                                                        name_l=  '上盖 - ' + list[i].property_name,
                                                        price += list[i].property_price*1
                                                }else{
                                                        name_r=  '上盖 - ' + list[i].property_name,
                                                        price+= list[i].property_price*1
                                                }
                                            }else if(num == 109){
                                                if(list[i].ear_mark == 1){
                                                        name_l =   '刻字 - ' + list[i].property_value,
                                                        name_r =   '刻字 - ' + list[i].property_value,
                                                        price = list[i].property_price*1
                                                }
                                            }
                                        }
                                        var obj = {
                                            name_l: name_l,
                                            name_r: name_r,
                                            price: price
                                        }
                                        return obj
                                    }
                                    function peijianCount(list){
                                        var arr = []
                                        for(var i = 0 ; i < list.length ; i ++){
                                            var obj = {}
                                            // if(list[i].isfirst == 1){
                                            //     obj = {
                                            //         name: list[i].prod_name + '(x'+list[i].quantity + ')',
                                            //         price: list[i].comb_price *1
                                            //     }
                                            // }else{
                                                obj = {
                                                    name: list[i].prod_name + '(x'+list[i].quantity + ')',
                                                    price: list[i].sale_amt
                                                }
                                            // }
                                            arr.push(obj)
                                        }
                                        return arr
                                    }
                                    var price_info_peijian = {
                                        clean: clean,
                                        sai: sai,
                                        kou: kou,
                                        shou: shou
                                    }
                                    var price_info_fenpin = [{
                                        name: fenpinPtylist[0].property_name,
                                        price: fenpinPtylist[0].property_price*1 + orderList.sale_price *1
                                    }]
                                    var price_info_model= [{
                                        name: modelPtylist[0].property_name,
                                        price: modelPtylist[0].property_price*1
                                    }]
                                    wx.setStorageSync('price_info_peijian', price_info_peijian)
                                    wx.setStorageSync('price_info_line', price_info_line)
                                    wx.setStorageSync('price_info', price_info)
                                    wx.setStorageSync('price_info_fenpin', price_info_fenpin)
                                    wx.setStorageSync('price_info_model', price_info_model)
                                    wx.hideLoading();
                                }
                            }
                        })
                    }
                }
            })
        })
    },
    toPay: function () {
        var that = this;
        wx.navigateTo({
            url: '/pages/toPay/weixin_pay/weixin_pay?order_no=' + that.data.order_no + '&price=' + that.data.orderList.order_amt
        })
    },
    //继续设计
    toDesign:function (){
        var t = this;
        wx.redirectTo({
            url: '../../design/design?design_id='+ t.data.order_no
        })
    },
    //删除设计
    goDelete:function (){
        var t = this;
        t.setData({
            popUp: true,
            pop_content: '是否删除设计'
        })
    },
    //确定删除
    confirmAction: function (){
        var t = this;
        var order_no = t.data.order_no;
        app.login(function () {
            wx.getStorage({
                key: 'uid',
                success: function (res) {
                    var uid = res.data;
                    app.take_token(
                        function (token) {
                            // var data = that.data;
                            wx.request({
                                url: globalData.apiURL + 'trading/design',
                                method: 'DELETE',
                                data: {
                                    token: token,
                                    uid: uid,
                                    design_id: order_no
                                },
                                success: function (res) {
                                    var res = res.data;
                                    // console.log(res.success);
                                    if(res.success){ //删除成功
                                        wx.reLaunch({
                                            url: '../order'
                                        })
                                    }
                                }
                            })
                        }
                    )
                }
            })
        })

    },
    //取消删除
    cancelAction: function (){
        var t = this;
        t.setData({
            popUp: false,
            pop_content: '是否删除设计'
        })
    },
    check_makerecordlist:function (){
        var status = this.data.status;
        var dlvr_date = this.data.dlvr_date;
        // console.log(status);
        wx.navigateTo({
            url: 'makerecordlist/makerecordlist?status=' + status + '&dlvr_date=' + dlvr_date
        })
    },
    toAddress: function (){ //去选地址下单
        var t = this;
        wx.redirectTo({
            url: '../../address/address?design_id='+ t.data.order_no + '&aliyun=' + t.data.err.sku_litimg
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})