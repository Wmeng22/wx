var app = getApp();
var globalData = app.globalData;
Page({
    data: {
        hasCanvas: false,
        uid: '',
        canvas_w: '',
        canvas_h: '',
        addr_num: '',
        cityData: '',
        region_id: ['广东省', '广州市', '海珠区'],
        add_err: false,
        name_err: false,
        iphone_err: false,
        err_content: '',

        name: '',
        iphone: '',
        address: '',
        isLoading: false,

        provinces: [],
        province: "",
        _province: "",
        citys: [],
        city: "",
        _city: "",
        countys: [],
        county: '',
        _county: '',
        value: [0, 0, 0],
        values: [0, 0, 0],
        condition: false,
        addr_num: '',
        tankuang: false,
        can: ''
    },
    onLoad: function (options) {
        var t = this;
        var design_id = options.design_id;
        var aliyun = options.aliyun;
        if(options.design_id){  //继续设计的状态
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
                                            info.kezi_price = thePtylist.property_price*1;
                                            info.kezi_color = thePtylist.property_des;
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
                                        pty_list: pty_list,
                                        quantity: 1,
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
                                                access_prodid: theProdlist.prod_cid,

                                            })
                                        }else{
                                            if(theProdlist.prod_cid == 10203 && theProdlist.isfirst == 1){

                                            }else{
                                                peijianList.push({
                                                    skuid: theProdlist.skuid,
                                                    is_comb: theProdlist.isfirst,
                                                    quantity: theProdlist.quantity,
                                                    category_id: theProdlist.prod_cid,
                                                    access_prodid: theProdlist.prod_id
                                                })
                                            }
                                        }
                                    }
                                    info.line = lineList;
                                    info.peijian = peijianList;
                                    info.design_id = design_id;
                                    info.completedDesign = true;
                                    t.setData({
                                        completedDesign: true
                                    })
                                    info.aliyun = aliyun;
                                    wx.setStorageSync('info', info);
                                    t.toReady();
                                }else{
                                    console.log('请求设计详情错误');
                                    console.log(res);
                                }
                            }
                        })
                    }
                })
            })
        }else{
            t.toReady();
        }
    },
    toReady:function (){
        var that = this;
        app.login(function () {
            //获取省市区数据
            wx.request({
                url: globalData.apiURL + 'common/region/all',
                success: function (res) {
                    var res = res.data;
                    if (res.success) {
                        var cityData = res.data.province;
                        that.setData({
                            cityData: cityData
                        })
                        //先获取默认的地址
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
                                            var data = res.data;
                                            if (data) {
                                                //有默认地址
                                                that.setData({
                                                    name: data.rcvr_name,
                                                    iphone: data.rcvr_mobile,
                                                    address: data.rcvr_addr_detl,
                                                    addr_num: data.addr_num
                                                })
                                                var provinces = [];
                                                var citys = [];
                                                var countys = [];
                                                var province_id = 0;
                                                var city_id = 0;
                                                var county_id = 0;
                                                var hasCounty = false;
                                                for (var i = 0; i < cityData.length; i++) {
                                                    provinces.push(cityData[i].name);
                                                    if (cityData[i].id == data.rcvr_addr_prvn) {
                                                        province_id = i;
                                                    }
                                                }
                                                for (var i = 0; i < cityData[province_id].list.length; i++) {
                                                    citys.push(cityData[province_id].list[i].name);
                                                    if (cityData[province_id].list[i].id == data.rcvr_addr_city) {
                                                        city_id = i;
                                                    }
                                                }
                                                for (var i = 0; i < cityData[province_id].list[city_id].list.length; i++) {
                                                    countys.push(cityData[province_id].list[city_id].list[i].name);
                                                    if (cityData[province_id].list[city_id].list[i].id == data.rcvr_addr_cnty) {
                                                        county_id = i;
                                                        hasCounty = true;
                                                    }
                                                }
                                                if (!hasCounty) {
                                                    var c = '';
                                                } else {
                                                    var c = cityData[province_id].list[city_id].list[county_id].name
                                                }
                                                that.setData({
                                                    provinces: provinces,
                                                    citys: citys,
                                                    countys: countys,

                                                    province: cityData[province_id].name,
                                                    city: cityData[province_id].list[city_id].name,
                                                    county: c,

                                                    _province: cityData[province_id].name,
                                                    _city: cityData[province_id].list[city_id].name,
                                                    _county: c,
                                                    isLoading: true,
                                                    value: [province_id, city_id, county_id],
                                                    values: [province_id, city_id, county_id]

                                                })

                                            } else {
                                                //没有默认地址
                                                const provinces = [];
                                                const citys = [];
                                                const countys = [];
                                                for (var i = 0; i < cityData.length; i++) {
                                                    provinces.push(cityData[i].name);
                                                }
                                                // console.log('省份完成');
                                                for (var i = 0; i < cityData[0].list.length; i++) {
                                                    citys.push(cityData[0].list[i].name)
                                                }
                                                // console.log('city完成');
                                                for (var i = 0; i < cityData[0].list[0].list.length; i++) {
                                                    countys.push(cityData[0].list[0].list[i].name)
                                                }
                                                that.setData({
                                                    provinces: provinces,
                                                    citys: citys,
                                                    countys: countys,

                                                    province: cityData[0].name,
                                                    city: cityData[0].list[0].name,
                                                    county: cityData[0].list[0].list[0].name,

                                                    _province: cityData[0].name,
                                                    _city: cityData[0].list[0].name,
                                                    _county: cityData[0].list[0].list[0].name,
                                                    isLoading: true,
                                                    value: [0, 0, 0],
                                                    values: [0, 0, 0],
                                                })
                                            }
                                            var info = wx.getStorageSync('info');
                                            // var info5 = info[5] //是公模还是私模
                                            // that.setData({
                                            //     model_type:info5
                                            // })
                                            // var info6 = info[6] //订单详情的图片
                                            if(info.completedDesign){
                                                wx.hideLoading();
                                            }else{
                                                var imgArr = wx.getStorageSync('imgArr') //订单详情的图片
                                                // console.log(imgArr);
                                                var imgs = [];
                                                var img = [];
                                                var imgArr_len = imgArr.length

                                                if (info.err.pty_list[5] != -1) { //有刻字
                                                    imgArr[4] = ''
                                                }

                                                for (var i = 0; i < imgArr_len; i++) {  //现在没有加耳机线了  耳机的图片,不要耳机线的图&& (i != info6_len - 2)
                                                    if (imgArr[i]) {
                                                        imgs.push(imgArr[i]);
                                                    }
                                                }
                                                var len = imgs.length;
                                                console.log(imgs);
                                                for (var i = 0; i < len; i++) {
                                                    (function(i){
                                                        wx.downloadFile({
                                                            url: imgs[i],
                                                            success: function (res) {
                                                                if(res.statusCode === 200){
                                                                    img[i] = res.tempFilePath;
                                                                    var flag = false;
                                                                    if (img.length === len) {
                                                                        for(var k = 0; k < img.length;k++){
                                                                            //console.log(img[k])
                                                                            if(img[k] == undefined ){
                                                                                flag = true
                                                                            }
                                                                        }
                                                                        if (!flag) {

                                                                            that.setData({
                                                                                hasCanvas: true
                                                                            })
                                                                            var ctx = wx.createCanvasContext('mycanvas');
                                                                            for (var j = 0; j < len; j++) {
                                                                                //console.log(img[j] + '下载里的顺序');
                                                                                (function(j){
                                                                                    setTimeout(function(){
                                                                                        if (len == 7) {   //说明没有刻字，有左logo
                                                                                            if (j == len - 3) { //左耳logo
                                                                                                ctx.drawImage(img[j], 70, 320, 74, 74);
                                                                                            } else if (j == len - 2) { //右耳logo
                                                                                                ctx.drawImage(img[j], 610, 322, 74, 74);
                                                                                            } else {
                                                                                                ctx.drawImage(img[j], 0, 0, 750, 640);
                                                                                            }
                                                                                        } else {//说明有刻字，没有左logo
                                                                                            if (j == len - 2) {
                                                                                                ctx.drawImage(img[j], 610, 322, 74, 74);
                                                                                            } else {
                                                                                                ctx.drawImage(img[j], 0, 0, 750, 640);
                                                                                            }
                                                                                        }
                                                                                        ctx.draw(true);
                                                                                    },0)

                                                                                })(j)
                                                                            }
                                                                            wx.hideLoading();
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            fail: function (res) {
                                                                console.log('downloadFile的fail输出');
                                                                console.log(res);
                                                            },
                                                            complete:function (res){
                                                                console.log('downloadFile的complete输出');
                                                                console.log(res);
                                                            }
                                                        })
                                                    })(i)
                                                }
                                            }
                                        }
                                    }
                                })
                            },
                            fail:function (res){
                                console.log('获取uid失败');
                                console.log(res);
                            }
                        })
                    }
                    else{
                        console.log('请求省市区数据失败');
                        console.log(res);
                    }
                },
                fail:function (res){
                    console.log(res);
                }
            })

        }, '/pages/address/address')

    },
    // 点击退出
    doExit: function () {
        this.setData({
            tankuang: true
        })
    },
    // 取消退出
    cancelAction: function () {
        this.setData({
            tankuang: false
        })
    },
    // 确认退出
    confirmAction: function () {
        this.setData({
            tankuang: true
        })
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    // 返回上一页
    goPre: function () {
        wx.redirectTo({
            url: '/pages/design/peijian/peijian'
        })
    },
    // 更改省市区
    bindChange: function (e) {
        var val = e.detail.value//当前选中的省市区的值
        var t = this.data.values;//上一次选中的省市区的值
        var cityData = this.data.cityData;

        //省 选择发生改变，则联动改变市和区
        if (val[0] != t[0]) {
            const citys = [];
            const countys = [];
            for (var i = 0; i < cityData[val[0]].list.length; i++) {
                citys.push(cityData[val[0]].list[i].name)
            }
            for (var i = 0; i < cityData[val[0]].list[0].list.length; i++) {
                countys.push(cityData[val[0]].list[0].list[i].name)
            }
            this.setData({
                province: this.data.provinces[val[0]],
                city: cityData[val[0]].list[0].name,
                citys: citys,
                county: cityData[val[0]].list[0].list[0].name,
                countys: countys,
                values: val,
                value: [val[0], 0, 0]
            })
            return;
        }
        //市 选择发生改变，则联动改区
        if (val[1] != t[1]) {
            const countys = [];
            if (cityData[val[0]].list[val[1]].list.length > 0) {
                for (var i = 0; i < cityData[val[0]].list[val[1]].list.length; i++) {
                    countys.push(cityData[val[0]].list[val[1]].list[i].name)
                }
            }
            var co = '';
            if (cityData[val[0]].list[val[1]].list[0]) {
                co = cityData[val[0]].list[val[1]].list[0].name;
            }
            this.setData({
                city: this.data.citys[val[1]],
                county: co,
                countys: countys,
                values: val,
                value: [val[0], val[1], 0]
            })
            return;
        }
        //区 选择发生改变
        if (val[2] != t[2]) {
            this.setData({
                county: this.data.countys[val[2]],
                values: val,
                value: [val[0], val[1], val[2]]
            })
            return;
        }
    },
    // 打开省市区列表
    open: function () {
        this.setData({
            condition: true,
        })
    },
    // 确实省市区选择
    confirm: function () {
        this.setData({
            condition: false,
            _province: this.data.province,
            _city: this.data.city,
            _county: this.data.county
        })
    },
    // 取消省市区选择
    cancel: function () {
        this.setData({
            condition: false
        })
    },
    // bindRegionChange: function (e) {
    //     // console.log('picker发送选择改变，携带值为', e.detail.value)
    //     this.setData({
    //         region: e.detail.value
    //     })
    // },
    // 手机、姓名、地址失去焦点时触发
    iphoneBlur: function (e) {
        this.setData({
            iphone: e.detail.value
        })
    },
    nameBlur: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    addressBlur: function (e) {
        this.setData({
            address: e.detail.value
        })
    },
    // 姓名、地址规则
    listmit: function () {
        var that = this;
        if (!that.data.name) {
            that.setData({
                name_err: true,
                name_err2: false
            });
            return false;
        } else {
            that.setData({
                name_err: false
            })
            var result = app.check_iphone(that.data.iphone);
            var checkContent = app.check_name(that.data.name);
            // var checkContent2 = app.check_name(that.data.address);
            if (result) {
                that.setData({
                    iphone_err: true,
                    name_err2:false,
                    add_err2: false,
                    err_content: result
                });
                return false;
            }else if(!checkContent){
                that.setData({
                    iphone_err: false,
                    name_err2: true,
                    add_err2: false,
                    err_content: '姓名不能包含特殊字符'
                });
                return false;
            }
            // else if(!checkContent2){
            //     that.setData({
            //         iphone_err:false,
            //         name_err2: false,
            //         add_err2: true,
            //         err_content: '地址不能包含特殊字符'
            //     });
            //     return false;
            // }
            else {
                that.setData({
                    iphone_err: false
                })
                if (!that.data.address) {
                    that.setData({
                        add_err: true,
                        err_content: '地址不能空'
                    });
                    return false;
                } else {
                    that.setData({
                        add_err: false
                    })
                    return true;
                }
            }
        }
    },
    // 更新地址
    submit: function () {
        if (this.listmit()) {
            // console.log('可以提交了');
            var cityData = this.data.cityData;
            var value1 = this.data.value[0];
            var value2 = this.data.value[1];
            var value3 = this.data.value[2];
            var rcvr_addr_prvn = cityData[value1].id;
            var rcvr_addr_city = cityData[value1].list[value2].id
            // console.log(cityData[value1].list[value2].list[value3])
            if (cityData[value1].list[value2].list[value3]) {
                var rcvr_addr_cnty = cityData[value1].list[value2].list[value3].id
            } else {
                var rcvr_addr_cnty = ''
            }
            this.setData({
                rcvr_addr_prvn: rcvr_addr_prvn,
                rcvr_addr_city: rcvr_addr_city,
                rcvr_addr_cnty: rcvr_addr_cnty
            })
            var that = this;
            var addr_num = that.data.addr_num;
            // 修改默认地址
            app.login(function () {
                wx.getStorage({
                    key: 'uid',
                    success: function (res) {
                        if (addr_num) {
                            app.take_token(function (token) {
                                var uid = res.data;
                                var token = token;
                                wx.request({
                                    url: globalData.apiURL + 'ucenter/address/update',
                                    method: 'PUT',
                                    data: {
                                        token: token,
                                        uid: uid,
                                        addr_num: that.data.addr_num,
                                        rcvr_name: that.data.name,
                                        rcvr_mobile: that.data.iphone,
                                        rcvr_addr_prvn: rcvr_addr_prvn,
                                        rcvr_addr_city: rcvr_addr_city,
                                        rcvr_addr_cnty: rcvr_addr_cnty,
                                        rcvr_addr_detl: that.data.address
                                    },
                                    success: function (res) {
                                        var res = res.data;
                                        if (res.success) {
                                            that.toSubmit()
                                        }else{
                                            console.log('更新地址失败');
                                            console.log(res);
                                        }
                                    }
                                })
                            })
                        } else {
                            that.toSubmit()
                        }
                    },
                    fail:function (res){
                        console.log(res);
                    }
                })
            })
        }
    },
    // 提交收货地址，用canvas将耳机各个部分的图片截成一张传给后台
    toSubmit: function () {
        var that = this;
        var uid = this.data.uid;
        wx.getStorage({
            key: 'info',
            success: function (res) {
                if(res.data.aliyun){
                    var aliyun = res.data.aliyun;
                    var addr_num = '';
                    if (that.data.addr_num) {   //有默认地址，直接用data中的addr_num
                        addr_num = that.data.addr_num;
                        wx.redirectTo({
                            url: '../toPay/toPay?aliyun=' + aliyun + '&addr_num=' + addr_num
                        })
                    } else {            //没有默认地址，说明用户没有地址，新增一个，然后获取默认地址的addr_num
                        app.take_token(function (token) {
                            var token = token;
                            wx.request({
                                url: globalData.apiURL + 'ucenter/address/add',
                                method: 'POST',
                                data: {
                                    token: token,
                                    uid: uid,
                                    rcvr_name: that.data.name,
                                    rcvr_mobile: that.data.iphone,
                                    rcvr_addr_prvn: that.data.rcvr_addr_prvn,
                                    rcvr_addr_city: that.data.rcvr_addr_city,
                                    rcvr_addr_cnty: that.data.rcvr_addr_cnty,
                                    rcvr_addr_detl: that.data.address,
                                },
                                success: function (res) {
                                    if (res.data.success) {
                                        wx.request({
                                            url: globalData.apiURL + 'ucenter/address/default/' + uid,
                                            success: function (res) {
                                                var res = res.data;
                                                if (res.success) {
                                                    addr_num = res.data.addr_num;
                                                    wx.redirectTo({
                                                        url: '../toPay/toPay?aliyun=' + aliyun + '&addr_num=' + addr_num
                                                    })
                                                }else{
                                                    console.log('请求默认地址失败');
                                                    console.log(res);
                                                }
                                            }
                                        })
                                    }else{
                                        console.log('添加地址失败');
                                    }
                                }
                            })
                        })
                    }
                }else{
                    wx.canvasToTempFilePath({
                        canvasId: 'mycanvas',
                        success: function success(res) {
                            var imageSrc = res.tempFilePath;
                            // 获取上传oss的配置信息
                            wx.request({
                                url: globalData.apiURL + 'common/oss/sign/lit-app',
                                success: function (res) {
                                    var res = res.data;
                                    var aliyun = res.data.dir + imageSrc.replace('wxfile://', '')
                                    if (res.success) {
                                        // 上传图片
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
                                                // var res = JSON.stringify(res);
                                                var addr_num = '';
                                                if (that.data.addr_num) {   //有默认地址，直接用data中的addr_num
                                                    addr_num = that.data.addr_num;
                                                    wx.redirectTo({
                                                        url: '../toPay/toPay?aliyun=' + aliyun + '&addr_num=' + addr_num
                                                    })
                                                } else {            //没有默认地址，说明用户没有地址，新增一个，然后获取默认地址的addr_num
                                                    app.take_token(function (token) {
                                                        var token = token;
                                                        wx.request({
                                                            url: globalData.apiURL + 'ucenter/address/add',
                                                            method: 'POST',
                                                            data: {
                                                                token: token,
                                                                uid: uid,
                                                                rcvr_name: that.data.name,
                                                                rcvr_mobile: that.data.iphone,
                                                                rcvr_addr_prvn: that.data.rcvr_addr_prvn,
                                                                rcvr_addr_city: that.data.rcvr_addr_city,
                                                                rcvr_addr_cnty: that.data.rcvr_addr_cnty,
                                                                rcvr_addr_detl: that.data.address,
                                                            },
                                                            success: function (res) {
                                                                if (res.data.success) {
                                                                    wx.request({
                                                                        url: globalData.apiURL + 'ucenter/address/default/' + uid,
                                                                        success: function (res) {
                                                                            var res = res.data;
                                                                            if (res.success) {
                                                                                addr_num = res.data.addr_num;
                                                                                wx.redirectTo({
                                                                                    url: '../toPay/toPay?aliyun=' + aliyun + '&addr_num=' + addr_num
                                                                                })
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        })
                                                    })
                                                }

                                                console.log('success:')
                                                console.log(res)
                                            },
                                            fail: function (res) {

                                                console.log('fail:')
                                                console.log(res)
                                            },
                                            complete: function (res) {

                                                console.log('complete:')
                                                console.log(res)
                                            }
                                        })
                                        // uploadTask.onProgressUpdate((res)=>{
                                        //   console.log('进度' + res.progress)
                                        //   console.log('已经上传的数据长度' + res.totalBytesSent)
                                        //   console.log('总进度' + res.totalBytesExpectedToSend)
                                        // })
                                    }else{
                                        console.log('请求litapp失败');
                                    }
                                }
                            })
                        },
                        fail:function (){
                            console.log('canvasToTempFilePath的fail输出');
                        },
                    });
                }
            },
            fail:function (res){
                console.log(res);
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})