layui.use(['table', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$;
    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/sensor/list",
        contentType: "application/json",
        async: false,
        dataType: "json",
        data: {},
        success: function (data) {
            let Sensorlist = data.data
            let cols;
            if (RightID == 3) {
                cols = [[ //表头
                    { field: 'SensorID', title: '传感器序号', width: '10%',  align: 'center' }
                    , { field: 'SensorName', title: '名称', width: '15%', align: 'center'  }
                    , { field: 'SensorType', title: '传感器类型', width: '12%', align: 'center' , templet: function(d){
                        if(d.SensorType === 0){
                            return '<span>位移</span>';
                        } else if(d.SensorType === 1){
                            return '<span>速度</span>';
                        }
                        else if(d.SensorType === 2){
                            return '<span>加速度</span>';
                        }
                        }  }
                    , { field: 'OutputType', title: '输出类型', width: '10%', align: 'center' , templet: function(d){
                        if(d.OutputType === 0){
                            return '<span>电压</span>';
                        } else if(d.OutputType === 1){
                            return '<span>电流</span>';
                        }
                        else if(d.OutputType === 2){
                            return '<span>其他</span>';
                        }
                    }  }
                    , { field: 'MeasureRange', title: '量程值', width: '10%', align: 'center'  }
                    , { field: 'RangeUnit', title: '量程单位', width: '10%' , align: 'center' }
                    , { field: 'Sensitivity', title: '灵敏度', width: '11%' , align: 'center'}
                    , { field: 'SensitivityUnit', title: '灵敏度单位', width: '10%' , align: 'center'}
                    , { field: 'LinearStart', title: '线性起点', width: '10%' , align: 'center'}
                ]]
            }
            else {
                cols = [[ //表头
                    { field: 'SensorID', title: '传感器序号', width: '10%',  align: 'center' }
                    , { field: 'SensorName', title: '名称', width: '10%', align: 'center'  }
                    , { field: 'SensorType', title: '传感器类型', width: '10%', align: 'center' , templet: function(d){
                            if(d.SensorType === 0){
                                return '<span>位移</span>';
                            } else if(d.SensorType === 1){
                                return '<span>速度</span>';
                            }
                            else if(d.SensorType === 2){
                                return '<span>加速度</span>';
                            }
                        }  }
                        , { field: 'OutputType', title: '输出类型', width: '10%', align: 'center' , templet: function(d){
                            if(d.OutputType === 0){
                                return '<span>电压</span>';
                            } else if(d.OutputType === 1){
                                return '<span>电流</span>';
                            }
                            else if(d.OutputType === 2){
                                return '<span>其他</span>';
                            }
                        }  }
                    , { field: 'MeasureRange', title: '量程值', width: '10%', align: 'center'  }
                    , { field: 'RangeUnit', title: '量程单位', width: '10%' , align: 'center' }
                    , { field: 'Sensitivity', title: '灵敏度', width: '10%' , align: 'center'}
                    , { field: 'SensitivityUnit', title: '灵敏度单位', width: '10%' , align: 'center'}
                    , { field: 'LinearStart', title: '线性起点', width: '10%' , align: 'center'}
                    , { title: '操作', width: '10%', templet: '#SensorManagementBar', align: 'center' }
                ]]
            }
            //第一个实例
            table.render({
                elem: '#SensorManagement'
                , data: Sensorlist
                , limit: Sensorlist.length
                , even: true
                , toolbar: RightID != 3 ? '#SensorManagementToolbar' : null
                , cols: cols
            });

            table.on('toolbar(SensorManagement)', function(obj){
                console.log(obj); // 查看对象所有成员
                
                // 根据不同的事件名进行相应的操作
                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                    case 'add':
                        layer.open({
                            type: 1,
                            area: '640px',
                            resize: false,
                            shadeClose: true,
                            title: '新增传感器',
                            content: `
                            <form class="layui-form" lay-filter="SensorAddLayer" action="">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">传感器名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="SensorName" required lay-verify="required" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">传感器类型</label>
                                    <div class="layui-input-block">
                                        <select name="SensorType" required lay-verify="required">
                                            <option value=0 selected>位移</option>
                                            <option value=1>速度</option>
                                            <option value=2>加速度</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">输出类型</label>
                                    <div class="layui-input-block">
                                        <select name="OutputType" required lay-verify="required">
                                            <option value=0 selected>电压</option>
                                            <option value=1>电流</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">量程值</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="MeasureRange" required lay-verify="required|float" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">量程单位</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="RangeUnit" required lay-verify="required" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">灵敏度</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Sensitivity" required lay-verify="required|float" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">灵敏度单位</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="SensitivityUnit" required lay-verify="required" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">线性起点</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="LinearStart" lay-verify="LinearStart" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-input-block">
                                        <button class="layui-btn" lay-submit lay-filter="SensorAddSubmit">保存</button>
                                    </div>
                                </div>
                            </form>
                              `,
                            success: function () {
                                // 对弹层中的表单进行初始化渲染
                                form.render('select');
                                form.verify({
                                    // 函数写法
                                    // 参数 value 为表单的值；参数 item 为表单的 DOM 对象
                                    float: function (value, item) {
                                        if (!new RegExp("^[0-9]+(.[0-9]+)?$").test(value)) {
                                            return '此处应填写数字';
                                        }
                                    },
                                    LinearStart: function (value, item) {
                                        if (value != '') {
                                            if (!new RegExp("^[0-9]+(.[0-9]+)?$").test(value)) {
                                                return '此处应填写数字';
                                            }
                                        }
                                    }
                                });
                                // 表单提交事件
                                form.on('submit(SensorAddSubmit)', function (data) {
                                    var field = data.field;
                                    field.SensorType = parseInt(field.SensorType)
                                    field.OutputType = parseInt(field.OutputType)
                                    // 此处可执行 Ajax 等操作
                                    $.ajax({
                                        type: 'POST',
                                        url: "http://" + host + "/cms/sensor/add",
                                        data: field,
                                        contentType: "application/x-www-form-urlencoded",
                                        async: false,
                                        dataType: "json",
                                        success: function (res) {
                                            if (res.data == 1){
                                                field.SensorID = parseInt(res.msg)
                                                layer.closeAll('page');
                                                layer.msg('新建成功');
                                                let tableDate = table.getData('SensorManagement');
                                                tableDate.push(field);
                                                table.reload('SensorManagement', {
                                                    data: tableDate
                                                    , limit: tableDate.length
                                                });
                                            }
                                            else {
                                                layer.msg('新建失败');
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
                    break;
                };
            });

            table.on('tool(SensorManagement)', function (obj) {
                var data = obj.data; // 得到当前行数据
                var index = obj.index; // 得到当前行索引
                var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
                var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
                var options = obj.config; // 获取当前表格基础属性配置项
                console.log(obj); // 查看对象所有成员

                // 根据 lay-event 的值执行不同操作
                if (layEvent === 'del') { //删除
                    layer.confirm('确定删除吗？', function (index) {
                        $.ajax({
                            type: 'POST',
                            url: "http://" + host + "/cms/sensor/delete",
                            data: {
                                SensorID: obj.data.SensorID
                            },
                            contentType: "application/x-www-form-urlencoded",
                            async: false,
                            dataType: "json",
                            success: function (res) {
                                if (res.data == 1){
                                    obj.del(); // 删除对应行（tr）的 DOM 结构，并更新缓存
                                    layer.msg('删除成功');
                                }
                                else {
                                    layer.msg('删除失败');
                                }
                            },
                            error: function () {
                                layer.msg('提交失败');
                            }
                        });
                        layer.close(index);
                    });
                } else if (layEvent === 'edit') { //编辑
                    // do something
                    layer.open({
                        type: 1,
                        area: '640px',
                        resize: false,
                        shadeClose: true,
                        title: '修改传感器',
                        content: `
                        <form class="layui-form" lay-filter="SensorEditLayer" action="">
                            <div class="layui-form-item">
                                <label class="layui-form-label">传感器名称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="SensorName" required lay-verify="required" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">传感器类型</label>
                                <div class="layui-input-block">
                                    <select name="SensorType" required lay-verify="required">
                                        <option value=0 selected>位移</option>
                                        <option value=1>速度</option>
                                        <option value=2>加速度</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">输出类型</label>
                                <div class="layui-input-block">
                                    <select name="OutputType" required lay-verify="required">
                                        <option value=0 selected>电压</option>
                                        <option value=1>电流</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">量程值</label>
                                <div class="layui-input-block">
                                    <input type="text" name="MeasureRange" required lay-verify="required|float" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">量程单位</label>
                                <div class="layui-input-block">
                                    <input type="text" name="RangeUnit" required lay-verify="required" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">灵敏度</label>
                                <div class="layui-input-block">
                                    <input type="text" name="Sensitivity" required lay-verify="required|float" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">灵敏度单位</label>
                                <div class="layui-input-block">
                                    <input type="text" name="SensitivityUnit" required lay-verify="required" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">线性起点</label>
                                <div class="layui-input-block">
                                    <input type="text" name="LinearStart" lay-verify="LinearStart" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <button class="layui-btn" lay-submit lay-filter="SensorEditSubmit">保存</button>
                                </div>
                            </div>
                        </form>
                          `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("SensorEditLayer", obj.data)
                            // 表单提交事件
                            form.on('submit(SensorEditSubmit)', function (data) {
                                var field = data.field; // 获取表单字段值
                                field.SensorID = obj.data.SensorID
                                // 此处可执行 Ajax 等操作
                                $.ajax({
                                    type: 'POST',
                                    url: "http://" + host + "/cms/sensor/update",
                                    data: field,
                                    contentType: "application/x-www-form-urlencoded",
                                    async: false,
                                    dataType: "json",
                                    success: function (res) {
                                        if (res.data == 1){
                                            layer.closeAll('page');
                                            obj.update(field);
                                            layer.msg('修改成功');
                                        }
                                        else {
                                            layer.msg('修改失败');
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
        error: function () {
            console.log('error')
        }
    })
});