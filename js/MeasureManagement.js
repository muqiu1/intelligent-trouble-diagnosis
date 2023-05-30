let FaultList = [];
let FaultDict = {};
layui.use(['table', 'laypage', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$

    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/fault/list",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        success: function (res) {
            FaultList = res.data.data;
            for (let i = 0; i < FaultList.length; i++) {
                FaultDict[FaultList[i].FaultID.toString()] = FaultList[i].FaultName;
            }
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/measure/list",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        success: function (res) {
            let data = res.data;
            console.log(data.data.length, data.data[0]);
            table.render({
                elem: '#MeasureManagement'
                , toolbar: RightID != 3  ? '#MeasureToolbar' : null
                , data: data.data
                , limit: data.data.length
                , cols: [[ //表头
                    { field: 'MeasureID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                    , { field: 'FaultName', title: '故障名称', width: '10%', align: 'center', templet: function (d) { return FaultDict[d.FaultID]; } }
                    , { field: 'FaultReason', title: '故障原因', width: '13%', align: 'center'}
                    , { field: 'Detail', title: '故障机理', width: '13%', align: 'center'}
                    , { field: 'CharacterName', title: '故障特征', width: '20%', align: 'center'}
                    , { field: 'Measures', title: '处置/维修措施', width: '20%', align: 'center'}
                    , { title: '操作', width: '14%', templet: '#MeasureOperator', align: 'center' }
                ]]
            });

            table.on('toolbar(MeasureManagement)', function(obj){
                console.log(obj); // 查看对象所有成员
                
                // 根据不同的事件名进行相应的操作
                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                    case 'add':
                        layer.open({
                            type: 1,
                            area: '750px',
                            resize: false,
                            shadeClose: true,
                            title: '新建维修策略',
                            content: `
                                <form class="layui-form" lay-filter="MeasureManagement-layer" style="margin: 16px; padding-right: 32px" onsubmit="return false">
                                    <div class="layui-form-item">
                                        <div class="layui-inline" style="width: 80%;">
                                            <label class="layui-form-label"><span class="layui-badge-dot"></span>故障名称</label>
                                            <div class="layui-input-inline" style="width: 300px;">
                                                <input type="text" name="FaultIDName" lay-verify="required" placeholder="请选择" autocomplete="off" class="layui-input" disabled>
                                            </div>
                                        </div>
                                        <div class="layui-inline" style="width: 50px;">
                                            <div class="layui-input-inline">
                                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick=changeFaultID()>选择</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>故障原因</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="FaultReason" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>故障机理</label>
                                        <div class="layui-input-block">
                                            <textarea placeholder="请输入输入框内容" name="Detail" class="layui-textarea" required lay-verify="required"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>振动故障特征</label>
                                        <div class="layui-input-block">
                                            <textarea placeholder="请输入输入框内容" name="CharacterName" class="layui-textarea" required lay-verify="required"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>处置/维修措施</label>
                                        <div class="layui-input-block">
                                            <textarea placeholder="请输入输入框内容" name="Measures" class="layui-textarea" required lay-verify="required"></textarea>
                                        </div>
                                    </div>
                                    <button style="margin-left: 600px" class="layui-btn" lay-submit lay-filter="MeasureManagementSubmit">新建</button>
                                </form>
                              `,
                            success: function () {
                                // 对弹层中的表单进行初始化渲染
                                form.render();
                                // 表单提交事件
                                form.on('submit(MeasureManagementSubmit)', function (data) {
                                    var field = data.field; // 获取表单字段值
                                    field.FaultID = field.FaultIDName.split(":")[0];
                                    // 此处可执行 Ajax 等操作
                                    $.ajax({
                                        type: 'POST',
                                        url: "http://" + host + "/cms/measure/add",
                                        data: field,
                                        contentType: "application/x-www-form-urlencoded",
                                        async: false,
                                        dataType: "json",
                                        success: function (res) {
                                            if (res.data == 1){
                                                layer.closeAll('page');
                                                layer.msg('新建成功');
                                                let tableDate = table.getData('MeasureManagement');
                                                field.MeasureID = parseInt(res.msg);
                                                tableDate.push(field);
                                                table.reload('MeasureManagement', {
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

            table.on('tool(MeasureManagement)', function (obj) {
                var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
                // console.log(obj); // 查看对象所有成员

                // 根据 lay-event 的值执行不同操作
                if (layEvent === 'detail') { //查看
                    layer.open({
                        type: 1,
                        area: '750px',
                        resize: false,
                        shadeClose: true,
                        title: '查看维修策略',
                        content: `
                            <form class="layui-form" lay-filter="MeasureManagement-layer" style="margin: 16px; padding-right: 32px">
                                <div class="layui-form-item">
                                    <div class="layui-inline" style="width: 80%;">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>故障名称</label>
                                        <div class="layui-input-inline" style="width: 300px;">
                                            <input type="text" name="FaultIDName" lay-verify="required" placeholder="请选择" autocomplete="off" class="layui-input" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障原因</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="FaultReason" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障机理</label>
                                    <div class="layui-input-block">
                                        <textarea placeholder="请输入输入框内容" name="Detail" class="layui-textarea" required lay-verify="required" disabled></textarea>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>振动故障特征</label>
                                    <div class="layui-input-block">
                                        <textarea placeholder="请输入输入框内容" name="CharacterName" class="layui-textarea" required lay-verify="required" disabled></textarea>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>处置/维修措施</label>
                                    <div class="layui-input-block">
                                        <textarea placeholder="请输入输入框内容" name="Measures" class="layui-textarea" required lay-verify="required" disabled></textarea>
                                    </div>
                                </div>
                            </form>
                        `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("MeasureManagement-layer", obj.data);
                            let FaultID = obj.data.FaultID;
                            let FaultIDName = FaultID + ':' + FaultDict[FaultID];
                            form.val("MeasureManagement-layer", {FaultIDName : FaultIDName});
                        }
                    });
                } else if (layEvent === 'del') { //删除
                    layer.confirm('确定删除吗？', function (index) {
                        $.ajax({
                            type: 'POST',
                            url: "http://" + host + "/cms/measure/delete",
                            data: {
                                MeasureID: obj.data.MeasureID
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
                        area: '750px',
                        resize: false,
                        shadeClose: true,
                        title: '修改维修策略',
                        content: `
                            <form class="layui-form" lay-filter="MeasureManagement-layer" style="margin: 16px; padding-right: 32px" onsubmit="return false">
                                <div class="layui-form-item">
                                    <div class="layui-inline" style="width: 80%;">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>故障名称</label>
                                        <div class="layui-input-inline" style="width: 300px;">
                                            <input type="text" name="FaultIDName" lay-verify="required" placeholder="请选择" autocomplete="off" class="layui-input" disabled>
                                        </div>
                                    </div>
                                    <div class="layui-inline" style="width: 50px;">
                                        <div class="layui-input-inline">
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick=changeFaultID()>选择</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障原因</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="FaultReason" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障机理</label>
                                    <div class="layui-input-block">
                                        <textarea placeholder="请输入输入框内容" name="Detail" class="layui-textarea" required lay-verify="required"></textarea>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>振动故障特征</label>
                                    <div class="layui-input-block">
                                        <textarea placeholder="请输入输入框内容" name="CharacterName" class="layui-textarea" required lay-verify="required"></textarea>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>处置/维修措施</label>
                                    <div class="layui-input-block">
                                        <textarea placeholder="请输入输入框内容" name="Measures" class="layui-textarea" required lay-verify="required"></textarea>
                                    </div>
                                </div>
                                <button style="margin-left: 600px" class="layui-btn" lay-submit lay-filter="MeasureManagementSubmit">修改</button>
                            </form>
                        `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("MeasureManagement-layer", obj.data);
                            let FaultID = obj.data.FaultID;
                            let FaultIDName = FaultID + ':' + FaultDict[FaultID];
                            form.val("MeasureManagement-layer", {FaultIDName : FaultIDName});

                            // 表单提交事件
                            form.on('submit(MeasureManagementSubmit)', function (data) {
                                var field = data.field; // 获取表单字段值
                                field.FaultID = field.FaultIDName.split(":")[0];
                                // 此处可执行 Ajax 等操作
                                $.ajax({
                                    type: 'POST',
                                    url: "http://" + host + "/cms/measure/update",
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
            console.log("AJAX ERROR!")
        }
    })
});

function changeFaultID(){
    layui.use(['table', 'form'], function () {
        var table = layui.table
            , form = layui.form
            , $ = layui.$
            , layer = layui.layer;
        var index2 = layer.open({
            type: 1,
            area: ['640px', '480px'],
            resize: false,
            shadeClose: true,
            offset: 'auto',
            title: '选择故障名称',
            content: `
                <div class="layui-row">
                    <table id="FaultTable" lay-filter="FaultTable"></table>
                </div>
            `,
            success: function () {
                // 对弹层中的表单进行初始化渲染
                table.render({
                    elem: '#FaultTable'
                    , data: FaultList
                    , limit: FaultList.length
                    , cols: [[ //表头
                        { title: '选择', width: '30%', type: 'radio', align: 'center'  }
                        , { field: 'FaultID', title: '序号', width: '30%',  align: 'center' }
                        , { field: 'FaultName', title: '名称', width: '40%', align: 'center'  }
                    ]]
                });
                // 单选框事件
                table.on('radio(FaultTable)', function(Fault){
                    form.val("MeasureManagement-layer", {
                        FaultIDName: Fault.data.FaultID + ':' + Fault.data.FaultName,
                    });
                    layer.close(index2);
                });
                table.on('rowDouble(FaultTable)', function(Fault){
                    form.val("MeasureManagement-layer", {
                        FaultIDName: Fault.data.FaultID + ':' + Fault.data.FaultName,
                    });
                    layer.close(index2);
                });
            }
        });
        return false;
    });
}