var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        catelist: '', //配件列表
        info: '', //缓存

        animationData: {},
    },
    onLoad: function (options) {
        var t = this;
        var peijian = '';
        try {
            var value = wx.getStorageSync('info');
            t.setData({
                info: value,
                pid: value.err.pid
            })
            // 缓存中选中的
            if (value.peijian) {
                // var arr = [];
                peijian = value.peijian;
                // for(var item in peijian){
                //     for(var i = 0 ; i < peijian[item].length ; i ++){
                //         arr.push(peijian[item][i]);
                //     }
                // }
                // peijian = arr;
            }else {
                peijian = []
            }
            // console.log(peijian);
            wx.request({
                url: globalData.apiURL + 'goods/product/lit-app/accessory/info/' + t.data.pid,
                success: function (res) {
                    var res = res.data;
                    if (res.success) {
                        var categorylist = res.data.categorylist;
                        var catelist = [];
                        for (var i = 0; i < categorylist.length; i++) {
                            if (categorylist[i].category_id != 10201) {//排除掉线材
                                var tmp = {};
                                tmp.ptylist = [];
                                tmp.category_name = categorylist[i].category_name;
                                for (var j = 0; j < categorylist[i].accessorylist.length; j++) {
                                    var propertylist = categorylist[i].accessorylist[j].propertylist[0];
                                    if (propertylist.propertylist) {   //多一层结构
                                        var ptylist_item = propertylist.propertylist;
                                        for (var k = 0; k < ptylist_item.length; k++) {
                                            // console.log( ptylist_item[k].detail_des);
                                            ptylist_item[k].category_id = categorylist[i].category_id;
                                            ptylist_item[k].accessory_name = categorylist[i].accessorylist[j].accessory_name;
                                            ptylist_item[k].access_prodid = categorylist[i].accessorylist[j].access_prodid;
                                            ptylist_item[k].quantity = 0;
                                            ptylist_item[k].show = false;
                                            for (var m = 0; m < peijian.length; m++) {
                                                if (peijian[m].skuid == ptylist_item[k].skuid) {
                                                    ptylist_item[k].quantity = peijian[m].quantity;
                                                    break;
                                                }
                                                // else {
                                                //     ptylist_item[k].quantity = 0;
                                                // }
                                            }
                                            tmp.ptylist.push(ptylist_item[k]);
                                        }
                                    } else {
                                        var ptylist_item = propertylist;
                                        ptylist_item.category_id = categorylist[i].category_id;
                                        ptylist_item.accessory_name = categorylist[i].accessorylist[j].accessory_name;
                                        ptylist_item.access_prodid = categorylist[i].accessorylist[j].access_prodid;
                                        ptylist_item.quantity = 0;
                                        ptylist_item.show = false;
                                        for (var m = 0; m < peijian.length; m++) {
                                            if (peijian[m].skuid == ptylist_item.skuid) {
                                                ptylist_item.quantity = peijian[m].quantity;
                                                break;
                                            }
                                            // else {
                                            //     ptylist_item.quantity = 0;
                                            // }
                                        }
                                        tmp.ptylist.push(ptylist_item);
                                    }
                                }
                                catelist.push(tmp);
                            }
                        }
                        t.setData({
                            catelist: catelist
                        })
                        console.log(catelist);
                        t.countPeijian()
                    }
                }
            })
        } catch (e) {
            // Do something when catch error
        }

        try {
            var price_info = wx.getStorageSync('price_info');
            var price_info_line = wx.getStorageSync('price_info_line');
            var price_info_peijian = wx.getStorageSync('price_info_peijian');
            var fenpinList = wx.getStorageSync('price_info_fenpin');
            var modelList = wx.getStorageSync('price_info_model');
            t.setData(
                {
                    list: price_info,
                    lineList: price_info_line,
                    peijianList: price_info_peijian,
                    fenpinList: fenpinList,
                    modelList:modelList
                }
            )
            // t.countFenpin();
            // t.countLine();
            t.getTotalPrice()
        } catch (e) {
            // Do something when catch error
        }
    },
    // 获取总价格
    getTotalPrice:function (){
        var t = this;
        var total = 0;
        if(t.data.list){
            total += getTotal(t.data.list)
        }
        if(t.data.lineList){
            total +=  getTotal(t.data.lineList)
        }
        if(t.data.peijianList){
            var peijianList = t.data.peijianList;
            var arr = [];
            for(var item in peijianList){
               
                for(var i = 0 ; i < peijianList[item].length ; i ++){
                    arr.push(peijianList[item][i]);
                }
            }
            // console.log(arr);
            total +=  getTotal(arr)
        }
        if(t.data.fenpinList){
            total +=  getTotal(t.data.fenpinList)
        }
        if(t.data.modelList){
            total +=  getTotal(t.data.modelList)
        }
        function getTotal(list){
            var total = 0;
            for(var i = 0 ; i < list.length ; i ++){
                total +=  list[i].price*1
            }
            return total;
        }
        this.setData({
            peijianList: arr,
            total_price: total
        })
    },
    // 获取配件的价格
    countPeijian: function (){
        var t = this;
        var catelist = t.data.catelist;
        var arr = [];
        var clean = [];
        var sai = [];
        var shou = [];
        var kou = [];
        for(var i = 0 ; i < catelist.length ; i ++){
           for(var j = 0 ; j < catelist[i].ptylist.length ; j ++){
               if (catelist[i].ptylist[j].quantity != 0) {
                   if(catelist[i].ptylist[j].category_id == 10202){ //清洁类
                       clean.push({
                           name: catelist[i].ptylist[j].accessory_name + ' x' + catelist[i].ptylist[j].quantity,
                           price: catelist[i].ptylist[j].quantity * catelist[i].ptylist[j].sale_price
                       })
                   }else if(catelist[i].ptylist[j].category_id == 10203) { //耳塞类
                       sai.push({
                           name: catelist[i].ptylist[j].accessory_name + ' x' + catelist[i].ptylist[j].quantity,
                           price: catelist[i].ptylist[j].quantity * catelist[i].ptylist[j].sale_price
                       })
                   }else if(catelist[i].ptylist[j].category_id == 10204){ //转接口
                       kou.push({
                           name: catelist[i].ptylist[j].accessory_name + ' x' + catelist[i].ptylist[j].quantity,
                           price: catelist[i].ptylist[j].quantity * catelist[i].ptylist[j].sale_price
                       })
                   }else if(catelist[i].ptylist[j].category_id == 10205){ //收纳盒
                       shou.push({
                           name: catelist[i].ptylist[j].accessory_name + ' x' + catelist[i].ptylist[j].quantity,
                           price: catelist[i].ptylist[j].quantity * catelist[i].ptylist[j].sale_price
                       })
                   }
                   // arr = [clean,sai,shou,kou]
                   arr = {
                       clean:clean,
                       sai:sai,
                       shou:shou,
                       kou:kou
                   }
               }
           }
        }
        // console.log(arr);
        t.setData({
            peijianList: arr,
        })
        try {
            wx.setStorageSync('price_info_peijian', arr)
        } catch (e) {
        }
        t.getTotalPrice()
    },
    // 修改缓存
    setStorage_zr: function () {
        var t = this;
        var info = t.data.info;
        var catelist = t.data.catelist;
        // console.log(catelist);
        var peijian = [];
        // peijian.clean = [];
        // peijian.sai = [];
        // peijian.shou = [];
        // peijian.kou = [];
        for (var i = 0; i < catelist.length; i++) {
            for (var j = 0; j < catelist[i].ptylist.length; j++) {
                if (catelist[i].ptylist[j].quantity > 0) {
                    // if(catelist[i].ptylist[j].category_id == 10202){ //清洁类
                    //     peijian.clean.push(catelist[i].ptylist[j])
                    // }else if(catelist[i].ptylist[j].category_id == 10203) { //耳塞类
                    //     peijian.sai.push(catelist[i].ptylist[j])
                    // }else if(catelist[i].ptylist[j].category_id == 10204){ //转接口
                    //     peijian.shou.push(catelist[i].ptylist[j])
                    // }else if(catelist[i].ptylist[j].category_id == 10205){ //收纳盒
                    //     peijian.kou.push(catelist[i].ptylist[j])
                    // }

                    peijian.push(catelist[i].ptylist[j])
                }
            }
        }
        info.peijian = peijian;
        // console.log(peijian);
        try {
            wx.setStorageSync('info', info)
        } catch (e) {
        }
    },
    // 减少 线材数量
    subtract: function (e) {
        var t = this;
        var idx = e.currentTarget.dataset.idx;
        var subidx = e.currentTarget.dataset.subidx;
        var catelist = t.data.catelist;
        if (catelist[idx].ptylist[subidx].quantity != 0) {
            catelist[idx].ptylist[subidx].quantity--
        }
        t.setData({
            catelist: catelist
        })
        t.countPeijian()
    },
    // 增加 线材数量
    add: function (e) {
        var t = this;
        var idx = e.currentTarget.dataset.idx;
        var subidx = e.currentTarget.dataset.subidx;
        // console.log(subidx);
        // console.log(idx);
        var catelist = t.data.catelist;
        catelist[idx].ptylist[subidx].quantity++;
        t.setData({
            catelist: catelist
        })
        t.countPeijian()
    },
    // 查看价格
    view_price: function () {
        var that = this;
        that.setData({
            showPrice: true,
            showPriceFade: true
        })
        var animation = wx.createAnimation({
            // transformOrigin:50% 50%,
            duration: 400,
            timingFunction: "ease-out",
            delay: 0
        })
        animation.translateY(-250).step();
        this.setData({
            animationData: animation.export()
        })
    },
    // 关闭价格列表
    remove_price_fade: function () {
        this.setData({
            showPrice: false,
            showPriceFade: false
        })
        var animation = wx.createAnimation({
            // transformOrigin:50% 50%,
            duration: 400,
            timingFunction: "ease-out",
            delay: 0
        })
        animation.translateY(0).step();
        this.setData({
            animationData: animation.export()
        })
    },
    // 上一步
    goPre: function () {
        var t = this;
        t.setStorage_zr()
        wx.redirectTo({
            url: '../design'
        })
    },
    // 下一步
    goNext: function () {
        var t = this;
        t.setStorage_zr()
        wx.redirectTo({
            url: "../../address/address"
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //显示或影藏配件的详情
    showDetail:function (e){
        var t = this;
        var idx = e.currentTarget.dataset.idx;
        var subidx = e.currentTarget.dataset.subidx;
        var catelist = t.data.catelist;
        catelist[idx].ptylist[subidx].show = !catelist[idx].ptylist[subidx].show;
        t.setData({
            catelist:catelist
        })

    }
})