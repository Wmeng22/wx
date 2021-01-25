var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        model_isprivate: 0, //公模私模
        nav: ['底壳', '面板', '刻字', 'Logo', '线材'],//可选项
        body: 'fuselage',   //机身/面板
        err: 2,     //0左耳/1右耳/2双耳
        nav_idx: 0,         //导航选中的项
        kezi: '', //刻字内容
        kezi_wrong1: false,
        kezi_wrong2: false,

        old_fuse: 0,    //上一次机身第一级
        old_panel: 0,   //上一次面板第一级

        // first_active: 0,    //第一级选中的项
        first_fuse: 0,      //机身第一级
        first_panel: 0,     //面板第一级
        first_logo: 0,     //logo第一级，当前只有正面，所以默认为0
        first_kezi: 0,

        fuse_l: 0,   //第二级机身左 选中项
        old_fuse_l: 0,   //第二级机身左 选中项
        fuse_r: 0,   //第二级机身右 选中项
        old_fuse_r: 0,   //第二级机身右 选中项
        panel_l: 0,  //第二级面板左 选中项
        old_panel_l: 0,  //第二级面板左 选中项
        panel_r: 0,  //第二级面板右 选中项
        old_panel_r: 0,  //第二级面板右 选中项
        logo_l: 0, //第二级logo左 选中项
        old_logo_l: 0, //第二级logo左 选中项
        logo_r: 0, //第二级logo右 选中项
        old_logo_r: 0, //第二级logo右 选中项
        kezi_l: 0, //第二级刻字左 选中项
        old_kezi_l: 0, //第二级刻字左 选中项
        old_kezi: '', //旧的刻字内容
        old_kezi_wrong1: false,
        old_kezi_wrong2: false,
        old_flag: true,

        line_db: 0,  //耳线 选中项
        second_active: 0,   //第二级选中的项

        isDesign: false,    //是否正在设计
        showFade: false,    //是否显示弹框
        showPrice: false,   //是否显示价格
        showPriceFade: false,   //是否显示价格弹框
        ptylist_first: [],      //第一级显示列表
        ptylist_second: [],     //第二级显示列表
        flag: true, //是否可点击定制

        fl_img: '', //机身左 图
        fr_img: '', //机身右 图
        logo_img_l: '', //logo 左 图
        logo_img_r: '', //logo 右 图
        kezi_color: '#fff', //刻字 左 颜色
        kezi_price: 0,

        total: 0, //线材总数
        THEdiscount: 0,//耳机线有优惠的那一款
        lineFlag: true, //是否有选耳机
        keziFlag: true,//刻字是否符合规范
        lastLine: 0,

        //价格
        list: [],
        lineList: [],
        listTotal: 0,
        lineTotal: 0,
        peijianTotal: 0,
        fenpinTotal: 0,
        total_price: 0,

        popUp: false, //弹框
        pop_content: '是否保存当前设计',

        imgArr:[],
        cost_time: 3,
        hasDesign: false,
        fuseFlag: true,

        animationData: {},
        SAVEs: true, //防止保存多次
        tutorial_nav: false, //导航教程
        tutorial_err: false,//左右耳切换教程
        tutorial_circle: [0,1],
        tutorial_circle_active: 0,

        starArr:[1,2,3,4,5]

    },
    onLoad: function (options) {
        var t = this;
        var design_id = options.design_id;
        if(options.design_id){  //继续设计的状态
            t.setData({
                hasDesign: true
            })
            app.login(function () {
                wx.getStorage({
                    key: 'uid',
                    success: function (res) {
                        var uid = res.data;
                        wx.request({
                            url: globalData.apiURL + 'trading/design/' + design_id +'?uid=' + uid,
                            success: function (res) {
                                var res = res.data;
                                if (res.success){
                                    var mydesignList = res.data;
                                            var info = {};
                                            var recommend = mydesignList//object
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
                                            info.err = {
                                                pid: recommend.product_id,
                                                skuid: recommend.skuid,
                                                is_comb:1,
                                                quantity:1,
                                                pty_list: pty_list,
                                                ear_name: recommend.design_name
                                            }
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
                                            console.log(lineList);
                                            info.peijian = peijianList;
                                            info.design_id = design_id;
                                    wx.setStorageSync('info', info);
                                    console.log(info);
                                    t.toReady();
                                }
                            }
                        })
                    }
                })
            })
        }else{
            var info = wx.getStorageSync('info');
            if(info.hasDesign){
                t.setData({
                    hasDesign: true
                })
            }
            t.toReady();
        }

    },
    toReady:function (){
        var t = this
        try {
            var info = wx.getStorageSync('info');
            var peijianList = wx.getStorageSync('price_info_peijian');
            var fenpinList = wx.getStorageSync('price_info_fenpin');
            var modelList = wx.getStorageSync('price_info_model');
            if (info) {

                t.setData({
                    info: info,
                    skuid: info.err.skuid,
                    pid: info.err.pid,
                    peijianList: peijianList,
                    fenpinList: fenpinList,
                    modelList:modelList,
                    model_isprivate: info.err.pty_list[8].pty_num
                })
                t.countPeijian();
                t.countFenpin();
                t.countModel();
                var pid = info.err.pid;
                var item = info.err.pty_list;
                var fuse_l = 0;
                var fuse_r = 0;
                var panel_l = 0;
                var panel_r = 0;
                var logo_l = 0;
                var logo_r = 0;
                var kezi_l = 0;
                var first_fuse = 0;
                var first_panel = 0;
                var first_logo = 0;
                var first_kezi = 0;
                wx.request({
                    url: globalData.apiURL + 'goods/product/lit-app/info/' + pid + '?ismetal=false',
                    success: function (res) {
                        if (res.data.success) {
                            var itemlist = res.data.data.itemlist;
                            for (var i = 0; i < itemlist.length; i++) {
                                if (itemlist[i].item_number == 105) {       //机身列表
                                    var fuse_Ptylist_r = itemlist[i].rightPtylist;
                                    var fuse_Ptylist_l = itemlist[i].leftPtylist;
                                    var l_arr = findIndex(fuse_Ptylist_l, item)
                                    var r_arr = findIndex(fuse_Ptylist_r, item)
                                    first_fuse = l_arr[0]
                                    fuse_l = l_arr[1];
                                    fuse_r = r_arr[1];
                                } else if (itemlist[i].item_number == 106) { //面板列表
                                    var panel_Ptylist_r = itemlist[i].rightPtylist;
                                    var panel_Ptylist_l = itemlist[i].leftPtylist;
                                    var l_arr = findIndex(panel_Ptylist_l, item);
                                    var r_arr = findIndex(panel_Ptylist_r, item);
                                    first_panel = l_arr[0]
                                    panel_l = l_arr[1];
                                    panel_r = r_arr[1];
                                } else if (itemlist[i].item_number == 109) { //刻字列表
                                    var kezi_Ptylist_l = itemlist[i].leftPtylist;
                                    if (item) {
                                        if (item[5] && item[5] != -1) {    //有刻字
                                            t.setData({
                                                kezi: item[5].pty_val,
                                                old_kezi: item[5].pty_val,
                                            })
                                        } else {            //无刻字
                                            t.setData({
                                                kezi: '',
                                                old_kezi: ''
                                            })
                                        }
                                    }
                                    var l_arr = findIndex(kezi_Ptylist_l, item);
                                    kezi_l = l_arr[1];
                                    first_kezi = l_arr[0]

                                } else if (itemlist[i].item_number == 114) { //LOGO列表
                                    var logo_Ptylist_r = itemlist[i].rightPtylist;
                                    var logo_Ptylist_l = itemlist[i].leftPtylist;
                                    var l_arr = findIndex(logo_Ptylist_l, item)
                                    var r_arr = findIndex(logo_Ptylist_r, item)
                                    first_logo = l_arr[0]
                                    logo_l = l_arr[1];
                                    logo_r = r_arr[1];
                                }
                            }

                            function findIndex(list, item) {
                                for (var m = 0; m < list.length; m++) {
                                    for (var i = 0; i < list[m].ptylist.length; i++) {
                                        if (list[m].ptylist[i] != -1) {
                                            for (var j = 0; j < item.length; j++) {
                                                if(item[j]){
                                                    if (item[j].pty_num == list[m].ptylist[i].property_number) {
                                                        return [m, i];
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                                return [0, 0];
                            }
                            fuse_Ptylist_l.push({
                                ptycategory_des: "Coming soon",
                                ptycategory_imgurl: "https://static.heys.com/wxapp/imgs/metal@2x.png",
                                ptycategory_name: "金属炫彩底壳",
                                ptylist:[{property_price:0}]
                            })
                            console.log(fuse_Ptylist_l);
                            t.setData({
                                ptylist_first: fuse_Ptylist_l,
                                fuse_Ptylist_l: fuse_Ptylist_l,
                                fuse_Ptylist_r: fuse_Ptylist_r,
                                panel_Ptylist_l: panel_Ptylist_l,
                                panel_Ptylist_r: panel_Ptylist_r,
                                kezi_Ptylist_l: kezi_Ptylist_l,
                                logo_Ptylist_l: logo_Ptylist_l,
                                logo_Ptylist_r: logo_Ptylist_r,
                                fuse_l: fuse_l,
                                fuse_r: fuse_r,
                                panel_l: panel_l,
                                panel_r: panel_r,
                                logo_l: logo_l,
                                logo_r: logo_r,
                                kezi_l: kezi_l,
                                first_fuse: first_fuse,
                                first_panel: first_panel,
                                first_logo: first_logo,
                                first_kezi: first_kezi
                            })
                            t.changeAllImg();
                            t.countPrice();
                            wx.hideLoading();
                        }
                    }
                })
                wx.request({
                    url: globalData.apiURL + 'goods/product/lit-app/accessory/info/' + pid,
                    success: function (res) {
                        if (res.data.success) {
                            var categorylist = res.data.data.categorylist;
                            if (info.line) {
                                var choosedLine = info.line;
                            } else {
                                for(var i = 0 ; i < categorylist.length ; i ++){
                                    if (categorylist[i].category_id == '10201'){
                                        var choosedLine = [
                                            {
                                                skuid: categorylist[i].accessorylist[i].propertylist[0].propertylist[0].skuid,  //默认选中第一条耳机线
                                                quantity: 1,
                                                is_comb:1
                                            }
                                        ]
                                    }
                                }

                            }
                            for (var i = 0; i < categorylist.length; i++) {
                                if (categorylist[i].category_id == '10201') {
                                    var accessorylist = categorylist[i].accessorylist;
                                    var line_Ptylist = [];
                                    for (var i = 0; i < accessorylist.length; i++) {
                                        if (accessorylist[i].access_prodid == "10035") {//蓝牙线特殊，少一级数据结构
                                            var paylist_item = accessorylist[i].propertylist[0];
                                            paylist_item.property_name = '';
                                            paylist_item.accessory_name = accessorylist[i].accessory_name;
                                            paylist_item.access_prodid = accessorylist[i].access_prodid;
                                            paylist_item.detail_des = paylist_item.detail_des.split('|');
                                            paylist_item.detail_des = JSON.parse(paylist_item.detail_des);
                                            paylist_item.quantity = 0;
                                            paylist_item.is_comb = 0;
                                            paylist_item.show = false;
                                            for (var j = 0; j < choosedLine.length; j++) {
                                                if (choosedLine[j].skuid == paylist_item.skuid) {
                                                    console.log('选中线的skuid');
                                                    console.log(choosedLine[j].skuid);
                                                    paylist_item.quantity = choosedLine[j].quantity;
                                                    paylist_item.is_comb = choosedLine[j].is_comb
                                                    break;
                                                }
                                            }
                                            line_Ptylist.push(paylist_item);
                                        } else {    //其他线
                                            var paylist_item = accessorylist[i].propertylist[0].propertylist;
                                            for (var j = 0; j < paylist_item.length; j++) {
                                                paylist_item[j].detail_des = JSON.parse(paylist_item[j].detail_des)
                                                console.log(paylist_item[j].detail_des);
                                                paylist_item[j].accessory_name = accessorylist[i].accessory_name;
                                                paylist_item[j].access_prodid = accessorylist[i].access_prodid;
                                                // paylist_item[j].detail_des = paylist_item[j].detail_des.split('|');
                                                paylist_item[j].quantity = 0;
                                                paylist_item[j].is_comb = 0;
                                                paylist_item[j].show = false;
                                                for (var k = 0; k < choosedLine.length; k++) {
                                                    if (choosedLine[k].skuid == paylist_item[j].skuid) {
                                                        console.log('选中线的skuid');
                                                        console.log(choosedLine[k].skuid);
                                                        paylist_item[j].quantity = choosedLine[k].quantity;
                                                        paylist_item[j].is_comb = choosedLine[k].is_comb;
                                                        // paylist_item[j].show = true;
                                                        break;
                                                    }
                                                }
                                                line_Ptylist.push(paylist_item[j]);
                                            }
                                        }
                                    }
                                    t.setData({
                                        line_Ptylist: line_Ptylist
                                    })
                                    var total = t.totalLine();
                                    t.setData({
                                        total: total,
                                    })
                                    t.findLastLine();
                                    t.changeLineImg();
                                    t.countLine();
                                    wx.hideLoading();
                                }
                            }
                        }
                    }
                })
            }
        } catch (e) {

        }
    },
    countFenpin:function (){
        var t = this;
        var arr = [];
        var fenpinTotal = 0;
        var fenpinList = t.data.fenpinList;
        for(var i = 0 ; i < fenpinList.length ; i ++){
            fenpinTotal += fenpinList[i].price
        }
        t.setData({
            fenpinTotal: fenpinTotal
        })
        t.getTotalPrice()
    },
    countModel:function (){
        var t = this;
        var arr = [];
        var modelTotal = 0;
        var modelList = t.data.modelList;
        for(var i = 0 ; i < modelList.length ; i ++){
            modelTotal += modelList[i].price*1
        }
        t.setData({
            modelTotal: modelTotal
        })
        t.getTotalPrice()
    },
    // 计算配件价格
    countPeijian: function () {
        var t = this;
        var peijianList = t.data.peijianList;
        var total = 0;
        if (peijianList) {
            var peijianList = t.data.peijianList;
            var arr = [];
            for(var item in peijianList){
                for(var i = 0 ; i < peijianList[item].length ; i ++){
                    arr.push(peijianList[item][i]);
                }
            }
            for (var i = 0; i < arr.length; i++) {
                total += arr[i].price
            }
        }
        t.setData({
            peijianList: arr,
            peijianTotal: total
        })
        t.getTotalPrice()
    },
    // 计算价格
    countPrice: function () {
        var t = this;
        var fl_pty = t.data.fuse_Ptylist_l[t.data.first_fuse].ptylist;
        var pl_pty = t.data.panel_Ptylist_l[t.data.first_panel].ptylist
        var ll_pty = t.data.logo_Ptylist_l[t.data.first_logo].ptylist;
        var kezi_pty = t.data.kezi_Ptylist_l[t.data.first_kezi].ptylist;
        var $kezi = 0;
        var $logo = 0;
        var $fuse = fl_pty[t.data.fuse_l].property_price * 2;
        var $panel = pl_pty[t.data.panel_l].property_price * 2;
        var ll_name = '无'
        if (t.data.keziFlag && t.data.kezi != '') {    //有刻字
            $logo = ll_pty[t.data.logo_l].property_price * 1;
            $kezi = kezi_pty[t.data.kezi_l].property_price * 1;
        } else {
            $logo = ll_pty[t.data.logo_l].property_price * 2;
            ll_name = ll_pty[t.data.logo_r].property_name;
        }
        var list = [
            {
                name_l: '下壳 - ' + fl_pty[t.data.fuse_l].property_name,
                name_r: '下壳 - ' + fl_pty[t.data.fuse_r].property_name,
                price: $fuse
            },
            {
                name_l: '上盖 - ' + pl_pty[t.data.panel_l].property_name,
                name_r: '上盖 - ' + pl_pty[t.data.panel_r].property_name,
                price: $panel
            },
            {
                name_l:  'Logo - ' + ll_name,
                name_r: 'Logo - ' + ll_pty[t.data.logo_r].property_name,
                price: $logo
            },
        ]
        if (t.data.keziFlag && t.data.kezi != '') {
            list.push(
                {
                    name_l: '刻字 - ' + t.data.kezi,
                    name_r: '刻字 - ' + t.data.kezi,
                    price: $kezi
                }
            )
        }
        t.setData({
            list: list,
            listTotal: $kezi + $logo + $fuse + $panel
        })
        try {
            wx.setStorageSync('price_info', list)
        } catch (e) {
        }
        t.getTotalPrice()
    },
    //获得总价
    getTotalPrice: function () {
        var t = this;
        this.setData({
            total_price: t.data.lineTotal + t.data.listTotal + t.data.peijianTotal + t.data.fenpinTotal + t.data.modelTotal
        })
    },
    // 计算耳机线的价格
    countLine: function () {
        var t = this;
        var arr = [];
        var lineTotal = 0;
        var line_pty = t.data.line_Ptylist;
        for (var i = 0; i < line_pty.length; i++) {
            if (line_pty[i].quantity > 0 && i != t.data.THEdiscount) {
                var p = line_pty[i].quantity * line_pty[i].sale_price;
                lineTotal += p;
                arr.push({
                    name: line_pty[i].accessory_name +' ' + line_pty[i].property_name +' x' + line_pty[i].quantity,
                    price: p
                })
            } else if (line_pty[i].quantity > 0 && i == t.data.THEdiscount) {
                var p = (line_pty[i].quantity - 1) * line_pty[i].sale_price + line_pty[i].comb_price * 1
                lineTotal += p;
                arr.push({
                    name: line_pty[i].accessory_name +' ' + line_pty[i].property_name + ' x' + line_pty[i].quantity,
                    price: p
                })
            }
        }
        t.setData({
            lineList: arr,
            lineTotal: lineTotal
        })
        try {
            wx.setStorageSync('price_info_line', arr)
        } catch (e) {
        }
        t.getTotalPrice()

    },
    // flag判断
    doFlag: function () {
        var t = this;
        //当前为刻字，且为空时false
        //有keziFlag&lineFlag为true,为true
        // console.log('下面为刻字');

        // console.log( t.data.kezi =='' && t.data.fuseFlag&& t.data.lineFlag);

        // if(t.data.nav_idx != 2 &&  t.data.kezi == ''&& t.data.lineFlag && t.data.fuseFlag){
        //     t.setData({
        //         flag: true
        //     })
        // }else if(t.data.kezi != '' && t.data.lineFlag && t.data.keziFlag && t.data.fuseFlag){
        //     t.setData({
        //         flag: true
        //     })
        // }else{
        //     t.setData({
        //         flag: false
        //     })
        // }
        if (t.data.nav_idx != 2 && t.data.lineFlag && t.data.keziFlag && t.data.fuseFlag) {
            t.setData({
                flag: true
            })
        } else if (t.data.nav_idx == 2 && t.data.kezi != '' && t.data.keziFlag && t.data.fuseFlag&& t.data.lineFlag) {
            t.setData({
                flag: true
            })
        } else {
            t.setData({
                flag: false
            })
        }
    },
    setStorage_zr: function () {
        var t = this;
        var info = t.data.info;
        // 左机身
        var fl_num = t.data.fuse_Ptylist_l[t.data.first_fuse].ptylist[t.data.fuse_l].property_number;
        // 右机身
        var fr_num = t.data.fuse_Ptylist_r[t.data.first_fuse].ptylist[t.data.fuse_r].property_number;
        // 左面板
        var pl_num = t.data.panel_Ptylist_l[t.data.first_panel].ptylist[t.data.panel_l].property_number;
        // 右面板
        var pr_num = t.data.panel_Ptylist_r[t.data.first_panel].ptylist[t.data.panel_r].property_number;
        // 刻字   
        var kezi_num = t.data.kezi_Ptylist_l[t.data.first_kezi].ptylist[t.data.kezi_l].property_number;
        // 左logo
        var logo_l = t.data.logo_Ptylist_l[t.data.first_logo].ptylist[t.data.logo_l].property_number;
        // 右logo
        var logo_r = t.data.logo_Ptylist_r[t.data.first_logo].ptylist[t.data.logo_r].property_number;
        //  线材
        var line = [];
        var line_ptylist = t.data.line_Ptylist;
        for (var i = 0; i < line_ptylist.length; i++) {
            if (line_ptylist[i].quantity > 0) {
                line.push(line_ptylist[i])
            }
        }
        info.hasDesign = t.data.hasDesign;
        info.err.pty_list[1] = {//左机身
            pty_num: fl_num,
            pty_val: ''
        }
        info.err.pty_list[2] = {//右机身
            pty_num: fr_num,
            pty_val: ''
        }
        info.err.pty_list[3] = {//左面板
            pty_num: pl_num,
            pty_val: ''
        }
        info.err.pty_list[4] = {//右面板
            pty_num: pr_num,
            pty_val: ''
        }
        if (t.data.kezi != '') { //有刻字
            info.err.pty_list[5] = {
                pty_num: kezi_num,
                pty_val: t.data.kezi
            }
            info.err.pty_list[6] = {
                pty_num: logo_r,
                pty_val: ''
            }
            info.err.pty_list[7] = -1;
        } else {      //没有刻字
            info.err.pty_list[5] = -1;
            info.err.pty_list[6] = {
                pty_num: logo_r,
                pty_val: ''
            }
            info.err.pty_list[7] = {
                pty_num: logo_l,
                pty_val: ''
            };
        }
        info.line = line;
        info.kezi_color = t.data.kezi_color;
        info.kezi_price = t.data.kezi_price*1;
        try {
            wx.setStorageSync('info', info)
        } catch (e) {
        }

    },
    // 选择 底壳/面板/刻字/Logo/线材
    choose_nav: function (e) {
        var t = this;
        var idx = e.currentTarget.dataset.idx
        var ptylist_first = [];
        switch (idx) {
            case 0:     //机身
                break;
            case 1:     //面板
                break;
            case 2:     //刻字
                break;
            case 3:     //logo
                break;
            default:    //线材
        }
        t.setData({
            nav_idx: idx,
            ptylist_first: ptylist_first
        })
        t.doFlag();
    },
    // 找到该显示的耳机线，最后一条
    findLastLine: function () {
        var t = this;
        var line_Ptylist = t.data.line_Ptylist;
        var lastLine = 0;
        for (var i = 0; i < line_Ptylist.length; i++) {
            if (line_Ptylist[i].quantity > 0) {
                lastLine = i;
            }
        }
        t.setData({
            lastLine: lastLine
        })
    },
    // 减少 线材数量
    subtract: function (e) {
        var t = this;
        var idx = e.currentTarget.dataset.idx;
        var line_Ptylist = t.data.line_Ptylist;

        if (line_Ptylist[idx].quantity != 0) {
            line_Ptylist[idx].quantity--;
        }
        var total = t.totalLine();
        if (total === 1) {
            for (var i = 0; i < line_Ptylist.length; i++) {
                line_Ptylist[i].is_comb = 0;
                if (line_Ptylist[i].quantity == 1) {
                    line_Ptylist[i].is_comb = 1;
                    t.setData({
                        THEdiscount: i
                    })
                }
            }
        }
        if (total > 0) {
            t.setData({
                lineFlag: true
            })
        }else{
            t.setData({
                lineFlag: false
            })
        }
        t.doFlag();
        t.setData({
            total: total,
            line_Ptylist: line_Ptylist,
            ptylist_first: line_Ptylist
        })
        t.findLastLine()
    },
    // 增加 线材数量
    add: function (e) {
        var t = this;
        var idx = e.currentTarget.dataset.idx;
        var line_Ptylist = t.data.line_Ptylist;
        if (line_Ptylist[idx].quantity < 99) {
            line_Ptylist[idx].quantity++;
        }
        t.setData({
            line_Ptylist: line_Ptylist
        })
        var total = t.totalLine();
        // console.log('总数');
        // console.log(total);
        if (total === 1) {
            for (var i = 0; i < line_Ptylist.length; i++) {
                line_Ptylist[i].is_comb = 0;
                if (line_Ptylist[i].quantity == 1) {
                    line_Ptylist[i].is_comb = 1;
                    t.setData({
                        THEdiscount: i
                    })
                }
            }
        }
        if (total > 0) {
            t.setData({
                lineFlag: true
            })
        }else{
            t.setData({
                lineFlag: false
            })
        }
        t.doFlag();
        t.setData({
            total: total,
            line_Ptylist: line_Ptylist,
            ptylist_first: line_Ptylist
        })
        t.findLastLine()
    },
    // 计算 线材总数
    totalLine: function () {
        var t = this;
        var line_Ptylist = t.data.line_Ptylist;
        var total = 0;
        for (var i = 0; i < line_Ptylist.length; i++) {
            total += line_Ptylist[i].quantity
        }
        return total;
    },
    // 选择 一级选项
    choose_first: function (e) {
        var t = this;
        var idx = e.currentTarget.dataset.idx;
        var nav_idx = t.data.nav_idx;
        switch (nav_idx) {
            case 0:     //机身
                if(idx == 1){
                    t.setData({
                        fuseFlag: false
                    })
                }else{
                    t.setData({
                        fuseFlag: true
                    })
                }
                t.doFlag()
                t.setData({
                    first_fuse: idx
                })
                break;
            case 1:     //面板
                t.setData({
                    first_panel: idx
                })
                break;
            case 2:     //刻字
                ptylist_first = t.data.kezi_Ptylist_l;
                break;
            case 3:     //logo
                ptylist_first = t.data.logo_Ptylist_l;
                break;
            default:    //线材
                ptylist_first = t.data.line_Ptylist;
        }
        // t.changeAllImg();
        this.setData({
            first_active: idx
        })
    },
    // 选择 二级选项
    choose_second: function (e) {
        var t = this;
        var nav_idx = t.data.nav_idx
        var idx = e.currentTarget.dataset.idx;
        var err = t.data.err;
        switch (nav_idx) {
            case 0:     //机身
                if (err === 0) {  //左耳
                    t.setData({
                        fuse_l: idx,
                    })
                } else if (err === 1) {
                    t.setData({
                        fuse_r: idx
                    })
                } else {
                    t.setData({
                        fuse_l: idx,
                        fuse_r: idx
                    })
                }
                break;
            case 1:     //面板
                if (err === 0) {  //左耳
                    t.setData({
                        panel_l: idx,
                    })
                } else if (err === 1) {
                    t.setData({
                        panel_r: idx
                    })
                } else {
                    t.setData({
                        panel_l: idx,
                        panel_r: idx
                    })
                }
                break;
            case 2:     //刻字
                t.setData({
                    kezi_l: idx
                })
                break;
            case 3:     //logo
                if (err === 0) {  //左耳
                    t.setData({
                        logo_l: idx,
                    })
                } else if (err === 1) {
                    t.setData({
                        logo_r: idx
                    })
                } else {
                    t.setData({
                        logo_l: idx,
                        logo_r: idx
                    })
                }
                break;
            default:    //线材

        }
        t.changeAllImg();
        t.countPrice();
        // t.countPeijian();
        t.getTotalPrice();
        t.setData({
            second_active: idx
        })
    },
    // 放弃 当前设计
    cancel: function () {
        wx.setNavigationBarTitle({
            title: '定制首页'
        })
        var t = this;
        t.setData({
            first_fuse: t.data.old_fuse,
            first_panel: t.data.old_panel,
            first_fuse: t.data.old_fuse,
            first_panel: t.data.old_panel,
            fuse_l: t.data.old_fuse_l,   //第二级机身左 选中项
            fuse_r: t.data.old_fuse_r,   //第二级机身右 选中项
            panel_l: t.data.old_panel_l,  //第二级面板左 选中项
            panel_r: t.data.old_panel_r,
            logo_l: t.data.old_logo_l,
            logo_r: t.data.old_logo_r,
            kezi_l: t.data.old_kezi_l,
            kezi: t.data.old_kezi,
            kezi_wrong1: t.data.old_kezi_wrong1,
            kezi_wrong2: t.data.old_kezi_wrong2,
            line_Ptylist: t.data.old_line_Ptylist,
            flag: t.data.old_flag,
            showFade: false,
            isDesign: false,
        })
        t.changeAllImg();
        t.countPrice();
        // t.countPeijian();
        t.getTotalPrice();

    },
    // 提交 一级选择
    submit_first: function () {
        var t = this;
        var second_active = 0;
        var isDesign = true;
        if (t.data.flag) {
            var first_active = 0;
            //如果第一级选项发生了更变，那么第二级选项则跳为第一个
            if (t.data.old_fuse != t.data.first_fuse) {
                t.setData({
                    fuse_l: 0,
                    fuse_r: 0
                })
            }
            if (t.data.old_panel != t.data.first_panel) {
                t.setData({
                    panel_l: 0,
                    panel_r: 0
                })
            }
            //当body和err都不为-1时
            var nav_idx = t.data.nav_idx;
            switch (nav_idx) {
                case 0:     //机身
                    wx.setNavigationBarTitle({
                        title: '定制页-机身'
                    })
                    first_active = t.data.first_fuse;
                    if (t.data.fuse_l != t.data.fuse_r) {
                        second_active = -1;
                    } else {
                        second_active = t.data.fuse_l;
                    }
                    t.setData({
                        second_active: second_active,
                        ptylist_first: t.data.fuse_Ptylist_l,
                        err: 2,
                    })
                    break;
                case 1:     //面板
                    wx.setNavigationBarTitle({
                        title: '定制页-面板'
                    })
                    first_active = t.data.first_panel;
                    if (t.data.panel_l != t.data.panel_r) {
                        second_active = -1;
                    } else {
                        second_active = t.data.panel_l;
                    }
                    t.setData({
                        second_active: second_active,
                        ptylist_first: t.data.panel_Ptylist_l,
                    })
                    break;
                case 2:     //刻字
                    wx.setNavigationBarTitle({
                        title: '定制页-刻字'
                    })
                    second_active = t.data.kezi_l;
                    t.setData({
                        err: 0,
                        ptylist_first: t.data.kezi_Ptylist_l
                    })
                    break;
                case 3:     //logo
                    wx.setNavigationBarTitle({
                        title: '定制页-logo'
                    })
                    first_active = t.data.first_logo;
                    if (t.data.logo_l != t.data.logo_r) {
                        second_active = -1;
                    } else {
                        second_active = t.data.logo_l;
                    }
                    if (t.data.kezi != '') { //有刻字
                        var err = 1;
                        second_active = t.data.logo_r;
                    }
                    t.setData({
                        err: err,
                        ptylist_first: t.data.logo_Ptylist_l
                    })
                    break;
                default:    //线材 不需要再进入选颜色的界面
                    t.countLine()
                    isDesign = false;
                    t.setData({
                        ptylist_first: t.data.line_Ptylist
                    })
            }
            var ptylist_second = t.data.ptylist_first[first_active].ptylist;
            try {
                var value = wx.getStorageSync('tutorial_err')
                if (value) {
                    // Do something with return value
                }else{
                    t.setData({
                        tutorial_err: true
                    })
                }
            } catch (e) {
                // Do something when catch error
            }
            t.setData({
                showFade: false,
                isDesign: isDesign,
                ptylist_second: ptylist_second,
                second_active: second_active
            })
            t.changeAllImg();
            t.countPrice();
            // t.countPeijian();
            t.getTotalPrice();
        }
    },
    // 前往设计
    go_design: function () {
        wx.setNavigationBarTitle({
            title: '定制部件选择'
        })
        var t = this;
        try {
            var value = wx.getStorageSync('tutorial_nav')
            if (value) {
                // Do something with return value
            }else{
                t.setData({
                    tutorial_nav: true
                })
            }
        } catch (e) {
            // Do something when catch error
        }
        t.setData({
            hasDesign: true
        })
        t.setData({
            old_fuse: t.data.first_fuse,
            old_panel: t.data.first_panel,
            old_fuse_l: t.data.fuse_l,   //第二级机身左 选中项
            old_fuse_r: t.data.fuse_r,   //第二级机身右 选中项
            old_panel_l: t.data.panel_l,  //第二级面板左 选中项
            old_panel_r: t.data.panel_r,
            old_logo_l: t.data.logo_l,
            old_logo_r: t.data.logo_r,
            old_kezi_l: t.data.kezi_l,
            old_kezi: t.data.kezi,
            old_kezi_wrong1: t.data.kezi_wrong1,
            old_kezi_wrong2: t.data.kezi_wrong2,
            old_flag: t.data.flag,
            old_line_Ptylist: t.data.line_Ptylist,
            showFade: true,
        })
    },
    // 关闭导航教程
    tutorial_nav_close:function (){
        var t = this;
        try {
            wx.setStorageSync('tutorial_nav', true);
            t.setData({
                tutorial_nav: false
            })
        } catch (e) {
        }

    },
    // 关闭导航教程
    tutorial_err_close:function (){
        var t = this;
        try {
            wx.setStorageSync('tutorial_err', true);
            t.setData({
                tutorial_err: false
            })
        } catch (e) {

        }
    },
    // 滑动
    swiperChange: function (e) {
        var current = e.detail.current;
        this.setData({
            tutorial_circle_active: current,
        })
        if(current == 2){
            this.tutorial_err_close()
        }
    },
    // 保存设计
    save_design: function () {
        wx.setNavigationBarTitle({
            title: '定制首页'
        })
        var that = this;
        that.setData({
            isDesign: false,
        })
    },
    // 查看价格列表
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
    // 改变左右耳
    bindPickerChange: function (e) {
        var t = this;
        var idx = e.currentTarget.dataset.idx * 1;
        var second_active = 0;
        var err = this.data.err;
        var tmp = 0;
        var nav_idx = t.data.nav_idx;
        if (nav_idx == 3 && t.data.kezi != '') {//有刻字时，logo不能切换成左耳
            tmp = 1;
            second_active = t.data.logo_l;
        } else if (nav_idx == 2) {
            tmp = 0;
            second_active = t.data.kezi_l;
        }
        else {
            switch (idx) {
                case 0:     //用户点击了左耳
                    if (err === 0) {
                        tmp = 1
                    } else if (err === 1) {
                        tmp = 2
                    } else {
                        tmp = 0
                    }
                    break;
                case 1:     //用户点击了右耳
                    if (err === 0) {
                        tmp = 2
                    } else if (err === 1) {
                        tmp = 0
                    } else {
                        tmp = 1
                    }
                    break;
                default:
            }
            switch (nav_idx) {
                case 0:     //机身
                    if (tmp == 1) {
                        second_active = t.data.fuse_r
                    } else if (tmp == 2) {
                        if (t.data.fuse_l == t.data.fuse_r) {
                            second_active = t.data.fuse_l
                        } else {
                            second_active = -1
                        }
                    } else {
                        second_active = t.data.fuse_l
                    }
                    break;
                case 1:     //面板
                    if (tmp == 1) {
                        second_active = t.data.panel_r
                    } else if (tmp == 2) {
                        if (t.data.panel_l == t.data.panel_r) {
                            second_active = t.data.panel_l
                        } else {
                            second_active = -1
                        }
                    } else {
                        second_active = t.data.panel_l
                    }
                    break;
                case 2:     //刻字
                    break;
                case 3:     //logo
                    if (tmp == 1) {
                        second_active = t.data.logo_r
                    } else if (tmp == 2) {
                        if (t.data.logo_l == t.data.logo_r) {
                            second_active = t.data.logo_l
                        } else {
                            second_active = -1
                        }
                    } else {
                        second_active = t.data.logo_l
                    }
                    break;
                default:    //线材
            }
        }
        this.setData({
            err: tmp,
            second_active: second_active
        })
    },
    // 改变耳机图片
    changeAllImg: function (i) {
        var t = this;
        var data = t.data;
        if(t.data.model_isprivate == 'PRIVATEMODEL'){ //如果是私模的话用attribute2_imgurl
            var fl_img = data.fuse_Ptylist_l[data.first_fuse].ptylist[data.fuse_l].attribute2_imgurl;
            var fr_img = data.fuse_Ptylist_r[data.first_fuse].ptylist[data.fuse_r].attribute2_imgurl;
            var pl_img = data.panel_Ptylist_l[data.first_panel].ptylist[data.panel_l].attribute2_imgurl;
            var pr_img = data.panel_Ptylist_r[data.first_panel].ptylist[data.panel_r].attribute2_imgurl;
        }else{
            var fl_img = data.fuse_Ptylist_l[data.first_fuse].ptylist[data.fuse_l].attribute_imgurl;
            var fr_img = data.fuse_Ptylist_r[data.first_fuse].ptylist[data.fuse_r].attribute_imgurl;
            var pl_img = data.panel_Ptylist_l[data.first_panel].ptylist[data.panel_l].attribute_imgurl;
            var pr_img = data.panel_Ptylist_r[data.first_panel].ptylist[data.panel_r].attribute_imgurl;
        }
        var logo_img_l = data.logo_Ptylist_l[data.first_logo].ptylist[data.logo_l].attribute_imgurl;
        var logo_img_r = data.logo_Ptylist_r[data.first_logo].ptylist[data.logo_r].attribute_imgurl;
        var kezi_color = data.kezi_Ptylist_l[data.first_kezi].ptylist[data.kezi_l].property_des;
        var kezi_price = data.kezi_Ptylist_l[data.first_kezi].ptylist[data.kezi_l].property_price*1;
        var imgArr = t.data.imgArr;
        imgArr[0] = fl_img;
        imgArr[1] = fr_img;
        imgArr[2] = pl_img;
        imgArr[3] = pr_img;
        imgArr[4] = logo_img_l;
        imgArr[5] = logo_img_r;
        // var imgArr = [fl_img, fr_img, pl_img, pr_img, logo_img_l, logo_img_r];
        t.setData({
            fl_img: fl_img,
            fr_img: fr_img,
            pl_img: pl_img,
            pr_img: pr_img,
            imgArr: imgArr,
            logo_img_l: logo_img_l,
            logo_img_r: logo_img_r,
            kezi_color: kezi_color,
            kezi_price:kezi_price
        });
        try {
            wx.setStorageSync('imgArr', imgArr)
        } catch (e) {
        }
    },
    // 改变耳线图片
    changeLineImg: function () {
        //进来了
        var t = this;
        var data = t.data;
        var line_img = data.line_Ptylist[data.lastLine].accessory_imgurl;
        var imgArr = t.data.imgArr;
        imgArr[6] = line_img;
        t.setData({
            imgArr: imgArr,
            line_img: line_img
        })
        try {
            wx.setStorageSync('imgArr', imgArr)
        } catch (e) {
        }
    },
    // 输入刻字内容
    writeName: function (e) {
        var t = this;
        var value = app.trim(e.detail.value);
        var keziFlag = true;
        var kezi_wrong1 = false;
        var kezi_wrong2 = false;
        if (value) {    //有值
            var sta = app.check_name(value);
            var len = app.check_kezi(value);
            if (!sta) { //含有特殊字符
                kezi_wrong2 = true;
                keziFlag = false
            }
            if (len > 4) {   //超过字数限制
                kezi_wrong1 = true;
                keziFlag = false
            }
        } else {    //无值
            kezi_wrong1 = false;
            kezi_wrong2 = false;
            keziFlag = true;
        }
        t.setData({
            kezi_wrong1: kezi_wrong1,
            kezi_wrong2: kezi_wrong2,
            kezi: value,
            keziFlag: keziFlag
        })
        t.doFlag();
    },
    // 上一步
    goPre: function () {
        var t = this;
        t.setStorage_zr();
        wx.redirectTo({
            url: 'named/named'
        })
    },
    // 下一步
    goNext: function () {
        var t = this;
        if(t.data.hasDesign){
            t.setStorage_zr();
            wx.redirectTo({
                url: 'peijian/peijian'
            })
        }

    },
    // 回到主页
    goHome: function () {
        var t = this;
        t.setData({
            popUp: true
        })
        var imgs = [];
        var img = [];

        var imgArr = t.data.imgArr;
        if (t.data.kezi != '' && t.data.keziFlag) { //有刻字
            imgArr[4] = ''
        }
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i]) {
                //console.log(info6[i] +'缓存里的顺序')
                imgs.push(imgArr[i]);
            }
        }
        var len = imgs.length;
        for (var i = 0; i < len; i++) {
            (function (i) {
                wx.downloadFile({
                    url: imgs[i],
                    success: function (res) {
                        img[i] = res.tempFilePath;
                        var flag = false;
                        if (img.length === len) {
                            for (var k = 0; k < img.length; k++) {
                                if (img[k] == undefined) {
                                    flag = true
                                }
                            }
                            if (!flag) {
                                t.setData({
                                    hasCanvas: true
                                })
                                var ctx = wx.createCanvasContext('mycanvas');
                                for (var j = 0; j < len; j++) {
                                    console.log(j);
                                    (function (j) {
                                        setTimeout(function () {
                                            if (len == 7) {   //说明没有刻字，有左logo
                                                if (j == len - 3) { //左耳logo
                                                    ctx.drawImage(img[j], 70, 320, 74, 74);
                                                } else if (j == len - 2) { //右耳logo
                                                    ctx.drawImage(img[j], 610, 322, 74, 74);
                                                } else {
                                                    ctx.drawImage(img[j], 0, 0, 750, 640);
                                                }
                                            }else {//说明有刻字，没有左logo
                                                if (j == len - 2) {
                                                    ctx.drawImage(img[j], 610, 322, 74, 74);
                                                } else {
                                                    ctx.drawImage(img[j], 0, 0, 750, 640);
                                                }
                                            }
                                                if( j == len - 1) {
                                                    t.setData({
                                                        cansave: true
                                                    })
                                                }
                                            ctx.draw(true);
                                        }, 0)
                                    })(j)
                                }
                            }
                        }
                    },
                    fail: function (res) {
                        console.log('downloadFile错误' + res);
                    }
                })
            })(i)

        }
    },
    //保存设计
    confirmAction: function () {
        var t = this;
        t.setStorage_zr();
        var info = wx.getStorageSync('info');
        if(info.peijian){ //配件
            for(var i = 0 ; i < info.peijian.length ; i ++){
                info.peijian[i].is_comb = 0;
            }
        }
        if(t.data.cansave && t.data.SAVEs){
            wx.showLoading({
                title: '加载中'
            })
            t.setData({
                SAVEs:false
            })
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function (res) {
                    var imageSrc = res.tempFilePath;
                    wx.request({
                        url: globalData.apiURL + 'common/oss/sign/lit-app',
                        success: function (res) {
                            if (res.data.success) {
                                var res = res.data;
                                // imageSrc =  imageSrc.replace('wxfile://', '');
                                // var imageSrcTpm =  imageSrc.replace('http://', '');
                                // var aliyun = res.data.dir + imageSrc;
                                var aliyun = res.data.dir + imageSrc.replace('wxfile://', '')
                                // var aliyunTpm = res.data.dir + imageSrcTpm;
                                wx.uploadFile({
                                    url: 'https://static.heys.com',
                                    filePath: imageSrc,
                                    name: 'file',
                                    formData: {
                                        key: aliyun,
                                        policy: res.data.policy,
                                        OSSAccessKeyId: res.data.accessid,
                                        success_action_status: "200",
                                        signature: res.data.signature
                                    },
                                    success: function (res) {
                                        console.log('success了');
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
                                                        if(pty_list[8].pty_num == 'PRIVATEMODEL'){
                                                            model = 1
                                                        }
                                                        for(var i = 0 ; i < pty_list.length ; i ++){
                                                            if(pty_list[i] != -1){
                                                                var obj = {}
                                                                obj.property_number = pty_list[i].pty_num;
                                                                obj.property_value = pty_list[i].pty_val;
                                                                designinfolist.push(obj)
                                                            }
                                                        }
                                                        for(var i = 0 ; i < info.line.length ; i ++){
                                                            var obj = {}
                                                            obj.skuid = info.line[i].skuid;
                                                            obj.quantity = info.line[i].quantity;
                                                            obj.isfirst = info.line[i].is_comb;
                                                            prodlist.push(obj)
                                                        }
                                                        if(info.peijian){
                                                            for(var i = 0 ; i < info.peijian.length ; i ++){
                                                                var obj = {}
                                                                obj.skuid = info.peijian[i].skuid;
                                                                obj.quantity = info.peijian[i].quantity;
                                                                obj.isfirst = info.peijian[i].is_comb;
                                                                prodlist.push(obj)
                                                            }
                                                        }
                                                        if(info.design_id){ //更新设计
                                                            wx.request({
                                                                url: globalData.apiURL + 'trading/design',
                                                                method: 'PUT',
                                                                data: {
                                                                    token: token,
                                                                    uid: uid,
                                                                    skuid: t.data.skuid,
                                                                    design_name: info.err.ear_name,
                                                                    // design_imgurl:  'https://static.heys.com/'  + aliyunTpm,
                                                                    design_imgurl:  'https://static.heys.com/'  + aliyun,
                                                                    design_id: info.design_id,
                                                                    // design_imgurl:  'https://static.heys.com/'  + aliyun.replace('http://', ''),
                                                                    model_isprivate: model,
                                                                    design_status: 0,
                                                                    designinfolist:designinfolist,
                                                                    prodlist:prodlist,
                                                                },
                                                                success: function (res) {
                                                                    t.setData({
                                                                        SAVEs: true
                                                                    })
                                                                    if(res.data.success){
                                                                        wx.hideLoading();
                                                                        wx.reLaunch({
                                                                            url: '/pages/index/index'
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        }else{ //提交设计
                                                            wx.request({
                                                                url: globalData.apiURL + 'trading/design',
                                                                method: 'POST',
                                                                data: {
                                                                    token: token,
                                                                    uid: uid,
                                                                    skuid: t.data.skuid,
                                                                    design_name: info.err.ear_name,
                                                                    // design_imgurl:  'https://static.heys.com/'  + aliyunTpm,
                                                                    design_imgurl:  'https://static.heys.com/'  + aliyun,
                                                                    // design_imgurl:  'https://static.heys.com/'  + aliyun.replace('http://', ''),
                                                                    model_isprivate: model,
                                                                    design_status: 0,
                                                                    designinfolist:designinfolist,
                                                                    prodlist:prodlist,
                                                                },
                                                                success: function (res) {
                                                                    // console.log(res);
                                                                    t.setData({
                                                                        SAVEs: true
                                                                    })
                                                                    if(res.data.success){
                                                                        wx.hideLoading();
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
                                    },
                                    fail: function (res) {
                                        console.log('fail:')
                                        console.log(res)
                                    },
                                    complete: function (res) {
                                        // console.log('complete:')
                                        // console.log(res)
                                    }
                                })
                            }
                        },
                        fail: function (res) {
                            console.log(res);
                        }
                    })
                },
                fail:function (res){
                    console.log(res);
                },
                complete: function (res) {
                    // console.log('complete:')
                    // console.log(res)
                }
            });
        }
    },
    //不保存设计
    cancelAction: function () {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //显示或影藏线材的详情
    showDetail:function (e){
        var t = this;
        var idx = e.currentTarget.dataset.idx;
        var line_Ptylist = t.data.line_Ptylist;
        console.log(line_Ptylist[idx]);

        line_Ptylist[idx].show = !line_Ptylist[idx].show;
        t.setData({
            line_Ptylist:line_Ptylist
        })

    }
})