let sensor = [];
layui.use(['table', 'laypage', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$
        , layer = layui.layer;

    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/mpparamsa/list",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        success: function (res) {
            let configSignal = res.data.configSignal;
            let data = res.data.list;
            sensor = res.data.sensor;
            console.log(data.length, data[0]);
            for (let i = 0; i < data.length; i++) {
                data[i]["mPTypeName"] = "振动测点";
                data[i]["signalName"] = null;
                data[i]["portIDList"] = [];
                for (let j = 0; j < configSignal.length; j++) {
                    if (data[i].signalID == configSignal[j].signalID) {
                        data[i]["signalName"] = configSignal[j].signalName;
                        data[i]["portIDList"] = configSignal[j].portID != null ? configSignal[j].portID.split(",") : [];
                        break;
                    }
                }
                for (let j = 0; j < sensor.length; j++) {
                    if (data[i].sensorID == sensor[j].SensorID) {
                        data[i]["sensitivity"] = sensor[j].Sensitivity;
                        break;
                    }
                }
            }
            table.render({
                elem: '#measuringPoint'
                , data: data
                , limit: data.length
                , even: true
                , cols: [[ //表头
                    { field: 'mPID', title: '序号', width: '10%', fixed: 'left', align: 'center'  }
                    , { field: 'mPName', title: '测点名称', width: '15%', align: 'center'  }
                    , { field: 'mPTypeName', title: '测点类型', width: '10%', align: 'center'  }
                    , { field: 'mPDetail', title: '测点位置', width: '10%', align: 'center'  }
                    , { field: 'signalName', title: '信号来源', width: '10%', align: 'center'  }
                    , { field: 'portID', title: '通道', width: '10%' , align: 'center' }
                    , { field: 'isEnable', title: '是否检测', width: '10%' , align: 'center', templet: function(d){
                        if(d.isEnable === 1){
                          return '<span>是</span>';
                        } else {
                          return '<span>否</span>';
                        }
                        } }
                    , { field: 'isOK', title: '是否OK', width: '10%' , align: 'center', templet: function(d){
                        if(d.isOK === 1){
                          return '<span>是</span>';
                        } else {
                          return '<span>否</span>';
                        }
                        } }
                    , { title: '操作', width: '15%', templet: '#measuring', align: 'center' }
                ]]
            });

            table.on('tool(measuringPoint)', function (obj) {
                // var data = obj.data; // 得到当前行数据
                // var index = obj.index; // 得到当前行索引
                var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
                // var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
                // var options = obj.config; // 获取当前表格基础属性配置项
                console.log(obj); // 查看对象所有成员

                if (layEvent === 'edit') { //编辑
                    // do something
                    var index1 = layer.open({
                        type: 1,
                        area: ['1200px', '800px'],
                        resize: false,
                        shade: false, // 不显示遮罩
                        shadeClose: true,
                        title: '查看详情',
                        content: $('#edit'),
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            var slct1 = document.getElementsByName("portID");
                            for (var k = 0; k < slct1.length; k++) {
                                slct1[k].innerHTML = "";
                                for (var i = 0; i < obj.data.portIDList.length; i++) {
                                    var op = document.createElement("option")
                                    op.setAttribute('value', obj.data.portIDList[i])
                                    op.innerHTML = obj.data.portIDList[i];
                                    slct1[k].appendChild(op)
                                }
                            }
                            var slct2 = document.getElementsByName("signalID");
                            for (var k = 0; k < slct2.length; k++) {
                                slct2[k].innerHTML = "";
                                for (var i = 0; i < configSignal.length; i++) {
                                    var op = document.createElement("option")
                                    op.setAttribute('value', configSignal[i].signalID)
                                    op.innerHTML = configSignal[i].signalName;
                                    slct2[k].appendChild(op)
                                }
                            }
                            function setInputDisable(almStrategy) {
                                if ( almStrategy == 0){ // 向上报警
                                    document.getElementById("almH2").disabled=false;
                                    document.getElementById("almH").disabled=false;
                                    document.getElementById("almL").disabled=true;
                                    document.getElementById("almL2").disabled=true;
                                    $("#almH2").removeClass("layui-unselect layui-disabled");
                                    $("#almH").removeClass("layui-unselect layui-disabled");
                                    $("#almL").addClass("layui-unselect layui-disabled");
                                    $("#almL2").addClass("layui-unselect layui-disabled");
                                }
                                else if (almStrategy == 1){ // 向下报警
                                    document.getElementById("almH2").disabled=true;
                                    document.getElementById("almH").disabled=true;
                                    document.getElementById("almL").disabled=false;
                                    document.getElementById("almL2").disabled=false;
                                    $("#almH2").addClass("layui-unselect layui-disabled");
                                    $("#almH").addClass("layui-unselect layui-disabled");
                                    $("#almL").removeClass("layui-unselect layui-disabled");
                                    $("#almL2").removeClass("layui-unselect layui-disabled");
                                }
                                else if (almStrategy == 2){ // 双向报警
                                    document.getElementById("almH2").disabled=false;
                                    document.getElementById("almH").disabled=false;
                                    document.getElementById("almL").disabled=false;
                                    document.getElementById("almL2").disabled=false;
                                    $("#almH2").removeClass("layui-unselect layui-disabled");
                                    $("#almH").removeClass("layui-unselect layui-disabled");
                                    $("#almL").removeClass("layui-unselect layui-disabled");
                                    $("#almL2").removeClass("layui-unselect layui-disabled");
                                }
                                else{
                                    document.getElementById("almH2").disabled=true;
                                    document.getElementById("almH").disabled=true;
                                    document.getElementById("almL").disabled=true;
                                    document.getElementById("almL2").disabled=true;
                                    $("#almH2").addClass("layui-unselect layui-disabled");
                                    $("#almH").addClass("layui-unselect layui-disabled");
                                    $("#almL").addClass("layui-unselect layui-disabled");
                                    $("#almL2").addClass("layui-unselect layui-disabled");
                                }
                            }
                            setInputDisable(parseInt(obj.data.almStrategy))
                            form.render();
                            form.val("measuringPoint-layer", obj.data);

                            // 表单提交事件
                            form.on('select(almStrategy)', function (data) {
                                setInputDisable(parseInt(data.value))
                            })
                            form.on('select(signalID)', function (data) {
                                var i = parseInt(data.value);
                                let j = 0;
                                for (; j < configSignal.length; j++) {
                                    if (configSignal[j].signalID == i) {
                                        obj.data.signalName = configSignal[j].signalName;
                                        obj.data.portIDList = configSignal[j].portID != null ? configSignal[j].portID.split(",") : [];
                                        break;
                                    }
                                }
                                var slct1 = document.getElementsByName("portID");
                                for (var k = 0; k < slct1.length; k++) {
                                    slct1[k].innerHTML = "";
                                    for (var i = 0; i < obj.data.portIDList.length; i++) {
                                        var op = document.createElement("option")
                                        op.setAttribute('value', obj.data.portIDList[i])
                                        op.innerHTML = obj.data.portIDList[i];
                                        slct1[k].appendChild(op)
                                    }
                                }
                                form.render('select');
                            })

                            form.on('submit(measuringPoint-submit)', function (data) {
                                var field = data.field; // 获取表单字段值
                                var updateField = {
                                    MPID: obj.data.mPID,
                                    MPName: field.mPName,
                                    MPDetail: field.mPDetail,
                                    SensorID: parseInt(field.sensorID),
                                    SignalID: parseInt(field.signalID),
                                    PortID: parseInt(field.portID),
                                    SampMode: parseInt(field.sampMode),
                                    IsEnable: parseInt(field.isEnable),
                                    AlmVar: parseInt(field.almVar),
                                    AlmStrategy: parseInt(field.almStrategy),
                                    AlmDelay1: parseInt(field.almDelay1),
                                    AlmDelay2: parseInt(field.almDelay2),
                                    Describe: field.describe,
                                };
                                if (updateField.SampMode == 0) {
                                    updateField.SampFreq = parseInt(field.sampFreq);
                                    updateField.SampLength = parseInt(field.sampLength);
                                }
                                else if (updateField.SampMode == 1) {
                                    updateField.SampDiv = parseInt(field.sampDiv);
                                    updateField.SampCycle = parseInt(field.sampCycle);
                                }

                                if (updateField.AlmStrategy == 0) { // 向上报警
                                    updateField.AlmH2 = parseFloat(field.almH2);
                                    updateField.AlmH = parseFloat(field.almH);
                                }
                                else if (updateField.AlmStrategy == 1) { // 向下报警
                                    updateField.AlmL2 = parseFloat(field.almL2);
                                    updateField.AlmL = parseFloat(field.almL);
                                }
                                else if (updateField.AlmStrategy == 2) { // 双向报警
                                    updateField.AlmH2 = parseFloat(field.almH2);
                                    updateField.AlmH = parseFloat(field.almH);
                                    updateField.AlmL2 = parseFloat(field.almL2);
                                    updateField.AlmL = parseFloat(field.almL);
                                }

                                console.log(updateField);
                                
                                // 此处可执行 Ajax 等操作
                                $.ajax({
                                    type: 'POST',
                                    url: "http://" + host + "/cms/mpparamsa/update",
                                    data: updateField,
                                    contentType: "application/x-www-form-urlencoded",
                                    async: false,
                                    dataType: "json",
                                    success: function (res) {
                                        if (res.code == 200){
                                            layer.close(index1)
                                            var result = {};
                                            for (key in updateField) {
                                                var val = updateField[key];
                                                key = key.replace( key[0], key[0].toLowerCase() );
                                                result[key] = val;
                                            }
                                            result.signalName = obj.data.signalName;
                                            result.portIDList = obj.data.portIDList;
                                            result.sensitivity = field.sensitivity;
                                            obj.update(result);
                                            layer.msg('保存成功');
                                        }
                                        else {
                                            layer.msg('保存失败');
                                        }
                                    },
                                    error: function () {
                                        layer.msg('提交失败');
                                    }
                                });
                                return false; // 阻止默认 form 跳转
                            });
                        }
                    });
                }
            });
        },
        error: function (res) {
            console.log("AJAX ERROR")
        }
    });
});

function changeSensorID(){
    layui.use(['table', 'laypage', 'form'], function () {
        var table = layui.table
            , form = layui.form
            , $ = layui.$
            , layer = layui.layer;
        var index2 = layer.open({
            type: 1,
            area: ['1200px', '550px'],
            resize: false,
            shadeClose: true,
            offset: 'auto',
            title: '选择传感器',
            content: `
                <div class="layui-row">
                    <table id="Sensor" lay-filter="Sensor"></table>
                </div>
            `,
            success: function () {
                // 对弹层中的表单进行初始化渲染
                table.render({
                    elem: '#Sensor'
                    , data: sensor
                    , limit: sensor.length
                    , even: true
                    , cols: [[ //表头
                        { title: '选择', width: 60, type: 'radio', align: 'center'  }
                        , { field: 'SensorID', title: '传感器序号', width: 60,  align: 'center' }
                        , { field: 'SensorName', title: '名称', width: 120, align: 'center'  }
                        , { field: 'SensorType', title: '传感器类型', width: 120, align: 'center' , templet: function(d){
                                if(d.SensorType === 0){
                                    return '<span>位移</span>';
                                } else if(d.SensorType === 1){
                                    return '<span>速度</span>';
                                }
                                else if(d.SensorType === 2){
                                    return '<span>加速度</span>';
                                }
                            }  }
                        , { field: 'OutputType', title: '输出类型', width: 120, align: 'center' , templet: function(d){
                                if(d.SensorType === 0){
                                    return '<span>电压</span>';
                                } else if(d.SensorType === 1){
                                    return '<span>电流</span>';
                                }
                                else if(d.SensorType === 2){
                                    return '<span>其他</span>';
                                }
                            }  }
                        , { field: 'MeasureRange', title: '量程值', width: 120, align: 'center'  }
                        , { field: 'RangeUnit', title: '量程单位', width: 120 , align: 'center' }
                        , { field: 'Sensitivity', title: '灵敏度', width: 120 , align: 'center'}
                        , { field: 'SensitivityUnit', title: '灵敏度单位', width: 120 , align: 'center'}
                        , { field: 'LinearStart', title: '线性起点', width: 120 , align: 'center'}
                    ]]
                });
                // 单选框事件
                table.on('radio(Sensor)', function(sen){
                    form.val("measuringPoint-layer", {
                        sensorID: sen.data.SensorID,
                        sensitivity: sen.data.Sensitivity,
                    });
                    layer.close(index2);
                });
                table.on('rowDouble(Sensor)', function(sen){
                    form.val("measuringPoint-layer", {
                        sensorID: sen.data.SensorID,
                        sensitivity: sen.data.Sensitivity,
                    });
                    layer.close(index2);
                });
            }
        });
        return false;
    });
}