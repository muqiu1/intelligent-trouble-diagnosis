initName()
dataTable = {
        111: { "id": 1, 'username': '一号机组', 'pointname': '1#测点' }, 112: { "id": 2, 'username': '一号机组', 'pointname': '2#测点' }
        , 113: { "id": 3, 'username': '一号机组', 'pointname': '3#测点' }, 114: { "id": 4, 'username': '一号机组', 'pointname': '4#测点' }
        , 115: { "id": 5, 'username': '一号机组', 'pointname': '5#测点' }
        , 211: { "id": 6, 'username': '二号机组', 'pointname': '1#测点' }, 212: { "id": 7, 'username': '二号机组', 'pointname': '2#测点' }
        , 213: { "id": 8, 'username': '二号机组', 'pointname': '3#测点' }, 214: { "id": 9, 'username': '二号机组', 'pointname': '4#测点' }
        , 215: { "id": 10, 'username': '二号机组', 'pointname': '5#测点' }
    }
function passTableData(index) {
    // console.log(index[0].id)
    data = []
    for (var i in index) {
        // console.log(index[i].id)
        data.push(dataTable[index[i].id])
    }
    // console.log(data)
    return data
}
dataTb = passTableData(checkedList)
drawTable()       
function drawTable(){
    layui.use('table', function () {
    var table = layui.table;
    //第一个实例
    // table.render({
    //     elem: '#table1'
    //     , height: 200
    //     // , data: dataTb
    //     , data: [
    //         {'id':1,'username':'一号机组','pointname':'1#测点','time':'2014-05-09 08:52:35','yyz':0.0125,'dfz':0.048,'ffz':0.0959,'fz_metric':7.6665,'mc_metric':13.0398,'yd_metric':21.442},
    //         {'id':2,'username':'一号机组','pointname':'2#测点','time':'2014-05-09 08:52:35','yyz':0.0132,'dfz':0.048,'ffz':0.096,'fz_metric':7.2922,'mc_metric':11.9435,'yd_metric':17.5096}
    //     ]
    //     , cols: [[ //表头
    //         { field: 'id', title: '序号', width: 80, fixed: 'left' }
    //         , { field: 'username', title: '机组名称', width: 120 }
    //         , { field: 'pointname', title: '测点名称', width: 120, }
    //         , { field: 'time', title: '采集时间', width: 200 }
    //         //, { field: 'yyz', title: '有效值/g', width: 120 }
    //         //, { field: 'dfz', title: '单峰值/g', width: 120, }
    //         , { field: 'ffz', title: '位移峰峰值/g', width: 120, }
    //         , { field: 'fz_metric', title: '峰值指标', width: 120 }
    //         , { field: 'mc_metric', title: '脉冲指标', width: 120, }
    //         , { field: 'yd_metric', title: '裕度指标', width: 120, }
    //         , { field: 'qd_metric', title: '峭度指标', width: 120, }
    //         , { field: 'pd_coeffcient', title: '偏度系数', width: 120, }
    //         , { field: 'bx_metric', title: '波形指标', width: 120 }
    //         , { field: 'bx_metric', title: '重心频率/Hz', width: 180 }
    //     ]]
    // });
    table.render({
        elem: '#table2'
        , height: 200
        // , data: dataTb
        , data: [
            {'id':1,'username':'转子试验台','pointname':'电机侧位移x','time':'2019-12-19 15:05:44','ffz':55,'0.5amplitude':0,'0.5phase':'19∠134°','sex':'3∠243°','city':'2∠133°','sign':0,'experience':'..'},
            {'id':2,'username':'转子试验台','pointname':'电机侧位移y','time':'2019-12-19 15:05:44','ffz':99,'0.5amplitude':0,'0.5phase':'31∠45°','sex':'4∠106°','city':'2∠122°','sign':0,'experience':'..'},
            {'id':3,'username':'转子试验台','pointname':'端侧位移x','time':'2019-12-19 15:05:44','ffz':65,'0.5amplitude':0,'0.5phase':'33∠116°','sex':'7∠156°','city':'2∠94°','sign':0,'experience':'..'},
            {'id':4,'username':'转子试验台','pointname':'端侧位移y','time':'2019-12-19 15:05:44','ffz':162,'0.5amplitude':0,'0.5phase':'51∠23°','sex':'4∠75°','city':'6∠156°','sign':1,'experience':'..'}

        ]
        , cols: [[ //表头
            { field: 'id', title: '序号', width: 80, fixed: 'left' }
            , { field: 'username', title: '机组名称', width: 120 }
            , { field: 'pointname', title: '测点名称', width: 120 }
            , { field: 'time', title: '采集时间', width: 200 }
            , { field: 'ffz', title: '位移峰峰值/um', width: 140, }
            , { field: '0.5amplitude', title: '0.5X幅值', width: 160 }
            , { field: '0.5phase', title: '1X矢量', width: 160 }
            , { field: 'sex', title: '2X矢量', width: 160 }
            , { field: 'city', title: '3X矢量', width: 160 }
            , { field: 'sign', title: '4X幅值', width: 160 }
            , { field: 'experience', title: '间隙电压/V', width: 160 }
            // , { field: 'score', title: '3X幅值/g', width: 160 }
            // , { field: 'classify', title: '3X相位/°', width: 160 }
            // , { field: '4amplitude', title: '4X幅值/g', width: 160 }
            // , { field: '5amplitude', title: '5X幅值/g', width: 160 }
        ]]
    });
});
}