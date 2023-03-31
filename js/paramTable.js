layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: '#time1'
        , value: '2022-11-22 17:03:22'
        , isInitValue: true
        , type: 'datetime'
    });
    laydate.render({
        elem: '#time2'
        , value: '2022-11-22 17:03:22'
        , isInitValue: true
        , type: 'datetime'
    });
});
dataTable = {
    29: { "id": 1, 'username': '一号机组', 'pointname': '1#测点' }, 30: { "id": 2, 'username': '一号机组', 'pointname': '2#测点' }
    , 31: { "id": 3, 'username': '一号机组', 'pointname': '3#测点' }, 32: { "id": 4, 'username': '一号机组', 'pointname': '4#测点' }
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
function drawTable() {
    layui.use('table', function () {
        var table = layui.table;
        //第一个实例
        table.render({
            elem: '#table1'
            , height: 200
            , data: dataTb
            , cols: [[ //表头
                { field: 'id', title: '序号', width: 80, fixed: 'left' }
                , { field: 'username', title: '电机名称', width: 120 }
                , { field: 'pointname', title: '测点名称', width: 120, }
                , { field: 'time', title: '采集时间', width: 200 }
                , { field: 'yyz', title: '有效值/g', width: 120 }
                , { field: 'dfz', title: '单峰值/g', width: 120, }
                , { field: 'ffz', title: '峰峰值/g', width: 120, }
                , { field: 'fz_metric', title: '峰值指标', width: 120 }
                , { field: 'mc_metric', title: '脉冲指标', width: 120, }
                , { field: 'yd_metric', title: '裕度指标', width: 120, }
                , { field: 'qd_metric', title: '峭度指标', width: 120, }
                , { field: 'pd_coeffcient', title: '偏度系数', width: 120, }
                , { field: 'bx_metric', title: '波形指标', width: 120 }
                , { field: 'bx_metric', title: '重心频率/Hz', width: 180 }
            ]]
        });
        table.render({
            elem: '#table2'
            , height: 200
            , data: dataTb
            , cols: [[ //表头
                { field: 'id', title: '序号', width: 80, fixed: 'left' }
                , { field: 'username', title: '电机名称', width: 120 }
                , { field: 'pointname', title: '测点名称', width: 120 }
                , { field: 'time', title: '采集时间', width: 200 }
                , { field: '0.5amplitude', title: '0.5X幅值/g', width: 160 }
                , { field: '0.5phase', title: '0.5X相位/°', width: 160 }
                , { field: 'sex', title: '1X幅值/g', width: 160 }
                , { field: 'city', title: '1X相位/°', width: 160 }
                , { field: 'sign', title: '2X幅值/g', width: 160 }
                , { field: 'experience', title: '2X相位/°', width: 160 }
                , { field: 'score', title: '3X幅值/g', width: 160 }
                , { field: 'classify', title: '3X相位/°', width: 160 }
                , { field: '4amplitude', title: '4X幅值/g', width: 160 }
                , { field: '5amplitude', title: '5X幅值/g', width: 160 }
            ]]
        });
    });
}
