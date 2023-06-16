var table1;
var setTimeOutId;
layui.use(['form', 'table', 'laydate'], function () {
    var form = layui.form
        , layer = layui.layer
        , laydate = layui.laydate
        , table = layui.table;

    //日期
    laydate.render({
        elem: '#alarmCenterTime1'
        , value: '2022-01-01 00:00:00'
        , isInitValue: true
        , type: 'datetime'
    });
    laydate.render({
        elem: '#alarmCenterTime2'
        , value: '2022-01-01 00:00:00'
        , isInitValue: true
        , type: 'datetime'
    });

    form.val('example', {
        "data": AlarmCenterPara.data
        , "date1": AlarmCenterPara.date1
        , "date2": AlarmCenterPara.date2
        , "typeOfData1": AlarmCenterPara.typeOfData1 == "on"
        , "typeOfData2": AlarmCenterPara.typeOfData2 == "on"
        , "allData": AlarmCenterPara.allData == "on"
    });

    //监听提交
    form.on('submit(demo1)', function (data) {
        AlarmCenterPara = data.field
        update(AlarmCenterPara)
        return false;
    });

    //表单取值
    layui.$('#LAY-component-form-getval').on('click', function () {
        table1.reload({
            data: [],
        });
        changeAlarmNumber(0);
    });
    layui.$('#LAY-component-form-getval2').on('click', function () {
        clearTimeout(setTimeOutId);
    });

    table1 = table.render({
        elem: '#alarm'
        , data: []
        , cellMinWidth: 80
        , even: true
        , cols: [[ //表头
            { title: '序号', fixed: 'left', type: 'numbers'}
            , { field: 'name', title: '电机' }
            , { field: 'pointname', title: '测点' }
            , { field: 'time', title: '时间' }
            , { field: 'value', title: '值' }
            , { field: 'unit', title: '单位' }
            , { field: 'type', title: '报警类型' }
            , { field: 'marker', title: '标示' }
            // { field: 'id', title: '序号', fixed: 'left' }
            // , { field: 'username', title: '用户' }
            // , { field: 'createTime', title: '创建时间' }
            // , { field: 'roleId', title: 'id' }
        ]]
    });

});
function update(para) {
    if (para.data == "历史数据") {
        var data = getData(para, para.date1, para.date2);
        document.getElementById('t').innerHTML = "历史数据：从" + para.date1 + "到" + para.date2 + "，共有" + data.length + "条记录";
        table1.reload({
            data: data,
            limit: data.length
        });
        changeAlarmNumber(data.length);
    }
    else if (para == AlarmCenterPara) {
        var time1 = new Date();
        var time2 = new Date(time1 - 10 * 60 * 1000);
        time1 = time1.toLocaleString('chinese',{hour12: false}).split('/').join('-');
        time2 = time2.toLocaleString('chinese',{hour12: false}).split('/').join('-');
        var data = getData(para, time1, time2);
        document.getElementById('t').innerHTML = "实时数据：从" + time1 + "到" + time2 + "，共有" + data.length + "条记录";
        table1.reload({
            data: data,
            limit: data.length
        });
        changeAlarmNumber(data.length);
        setTimeOutId = setTimeout(function () { update(para); }, 3000);
    }
}

function getData(para, time1, time2) {
    return new Array(Math.floor(Math.random() * 10 + 1)).fill({ "id": 1, 'name': '一号机组', 'pointname': '1#测点', 'time': time1, 'value': '1', 'unit': 'um', 'type': '报警', 'marker': '1' });
    layui.$.ajax({
        type:'POST',
        url: "http://192.168.10.104:8080/cms/user/list",
        contentType: "application/json",
        async : false,
        dataType : "json",
        data:{},
        success: function(data){
            dataList = data.data.list
            document.getElementById('t').innerHTML = "历史数据：从" + time1 + "到" + time2 + "，共有" + dataList.length + "条记录";
            console.log(dataList)
            table1.reload({
                    data: dataList
                });
        },
        error: function(){
            console.log('error')
        }
    })
}