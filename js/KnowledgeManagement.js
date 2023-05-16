layui.use(['table', 'laypage', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$

    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/faultdiagnosis/characterList",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        success: function (res) {
            let data = res.data;
            console.log(data.data.length, data.data[0]);
            table.render({
                elem: '#KnowledgeManagement'
                , toolbar: '#toolbar'
                , data: data.data
                , limit: data.data.length
                , cols: [[ //表头
                    { field: 'CharacterID', title: '序号', width: '10%', fixed: 'left', align: 'center' }
                    , { field: 'CharacterName', title: '征兆名称', width: '20%', align: 'center' }
                    , { field: 'Detail', title: '征兆描述', width: '53%', align: 'center' }
                    , { title: '操作', width: '17%', templet: '#Management', align: 'center' }
                ]]
            });

            table.on('toolbar(KnowledgeManagement)', function(obj){
                console.log(obj); // 查看对象所有成员
                
                // 根据不同的事件名进行相应的操作
                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                    case 'add':
                        layer.open({
                            type: 1,
                            area: '640px',
                            resize: false,
                            shadeClose: true,
                            title: '新建征兆',
                            content: `
                                <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="CharacterName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>人工征兆</label>
                                        <div class="layui-input-block">
                                            <input type="checkbox" name="IsManual" lay-skin="switch" title="否|是">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆类型</label>
                                        <div class="layui-input-block">
                                        <select name="CharacterType" required lay-verify="required">
                                            <option value="0">固定特征</option>
                                            <option value="1">频谱特征</option>
                                            <option value="2">相位特征</option>
                                            <option value="3">轴心轨迹特征</option>
                                            <option value="4">转动特征</option>
                                            <option value="5">振动方向</option>
                                            <option value="6">过临界振动特征</option>
                                            <option value="7">非线性特征</option>
                                            <option value="8">其他特征</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">相关参数</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Params" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label"><span class="layui-badge-dot"></span>级数</label>
                                            <div class="layui-input-inline" style="width: 30%;">
                                                <input type="number" name="Leve" required lay-verify="required" class="layui-input" value="1">
                                            </div>
                                        </div>
                                        <div class="layui-inline" style="width: 40%;">
                                            <label class="layui-form-label">判断运算符</label>
                                            <div class="layui-input-inline" style="width: 35%;">
                                                <select name="Operator">
                                                    <option value="&lt;">&lt;</option>
                                                    <option value="&gt;">&gt;</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">多级阈值</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Threshold" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>详细描述</label>
                                        <div class="layui-input-block">
                                            <textarea placeholder="请输入内容" name="Detail" class="layui-textarea" required lay-verify="required"></textarea>
                                        </div>
                                    </div>
                                    <button class="layui-btn" lay-submit lay-filter="Management-submit">新建</button>
                                </form>
                              `,
                            success: function () {
                                // 对弹层中的表单进行初始化渲染
                                form.render();
                                // 表单提交事件
                                form.on('submit(Management-submit)', function (data) {
                                    var field = data.field; // 获取表单字段值
                                    field.IsManual = field.IsManual == "on" ? 1 : 0
                                    console.log(field)
                                    // 此处可执行 Ajax 等操作
                                    $.ajax({
                                        type: 'POST',
                                        url: "http://" + host + "/cms/faultdiagnosis/characterAdd",
                                        data: field,
                                        contentType: "application/x-www-form-urlencoded",
                                        async: false,
                                        dataType: "json",
                                        success: function (res) {
                                            if (res.data == 1){
                                                layer.closeAll('page');
                                                layer.msg('新建成功');
                                                loadPage('KnowledgeManagement');
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

            table.on('tool(KnowledgeManagement)', function (obj) {
                var data = obj.data; // 得到当前行数据
                var index = obj.index; // 得到当前行索引
                var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
                var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
                var options = obj.config; // 获取当前表格基础属性配置项
                console.log(obj); // 查看对象所有成员

                // 根据 lay-event 的值执行不同操作
                if (layEvent === 'detail') { //查看
                    layer.open({
                        type: 1,
                        area: '640px',
                        resize: false,
                        shadeClose: true,
                        title: '查看征兆',
                        content: `
                            <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="CharacterName" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>人工征兆</label>
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="IsManual" lay-skin="switch" title="否|是" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆类型</label>
                                    <div class="layui-input-block">
                                    <select name="CharacterType" disabled>
                                        <option value="0">固定特征</option>
                                        <option value="1">频谱特征</option>
                                        <option value="2">相位特征</option>
                                        <option value="3">轴心轨迹特征</option>
                                        <option value="4">转动特征</option>
                                        <option value="5">振动方向</option>
                                        <option value="6">过临界振动特征</option>
                                        <option value="7">非线性特征</option>
                                        <option value="8">其他特征</option>
                                    </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">相关参数</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Params" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-inline">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>级数</label>
                                        <div class="layui-input-inline" style="width: 30%;">
                                            <input type="number" name="Leve" class="layui-input" value="1" disabled>
                                        </div>
                                    </div>
                                    <div class="layui-inline" style="width: 40%;">
                                        <label class="layui-form-label">判断运算符</label>
                                        <div class="layui-input-inline" style="width: 35%;">
                                            <select name="Operator" disabled>
                                                <option value="&lt;">&lt;</option>
                                                <option value="&gt;">&gt;</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">多级阈值</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Threshold" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>详细描述</label>
                                    <div class="layui-input-block">
                                        <textarea name="Detail" class="layui-textarea" disabled></textarea>
                                    </div>
                                </div>
                            </form>
                          `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("Management-layer", obj.data);
                        }
                    });
                } else if (layEvent === 'del') { //删除
                    layer.confirm('确定删除吗？', function (index) {
                        $.ajax({
                            type: 'POST',
                            url: "http://" + host + "/cms/faultdiagnosis/characterDelete",
                            data: {
                                CharacterID: obj.data.CharacterID
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
                        title: '修改征兆',
                        content: `
                            <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="CharacterName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>人工征兆</label>
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="IsManual" lay-skin="switch" title="否|是">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆类型</label>
                                    <div class="layui-input-block">
                                    <select name="CharacterType" required lay-verify="required">
                                        <option value="0">固定特征</option>
                                        <option value="1">频谱特征</option>
                                        <option value="2">相位特征</option>
                                        <option value="3">轴心轨迹特征</option>
                                        <option value="4">转动特征</option>
                                        <option value="5">振动方向</option>
                                        <option value="6">过临界振动特征</option>
                                        <option value="7">非线性特征</option>
                                        <option value="8">其他特征</option>
                                    </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">相关参数</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Params" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-inline">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>级数</label>
                                        <div class="layui-input-inline" style="width: 30%;">
                                            <input type="number" name="Leve" required lay-verify="required" class="layui-input" value="1">
                                        </div>
                                    </div>
                                    <div class="layui-inline" style="width: 40%;">
                                        <label class="layui-form-label">判断运算符</label>
                                        <div class="layui-input-inline" style="width: 35%;">
                                            <select name="Operator">
                                                <option value="&lt;">&lt;</option>
                                                <option value="&gt;">&gt;</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">多级阈值</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Threshold" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>详细描述</label>
                                    <div class="layui-input-block">
                                        <textarea placeholder="请输入内容" name="Detail" class="layui-textarea" required lay-verify="required"></textarea>
                                    </div>
                                </div>
                                <button class="layui-btn" lay-submit lay-filter="Management-submit">修改</button>
                            </form>
                          `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("Management-layer", obj.data)
                            // 表单提交事件
                            form.on('submit(Management-submit)', function (data) {
                                var field = data.field; // 获取表单字段值
                                field.CharacterID = obj.data.CharacterID
                                field.IsManual = field.IsManual == "on" ? 1 : 0
                                field.RuleID = obj.data.RuleID
                                console.log(field)
                                // 此处可执行 Ajax 等操作
                                $.ajax({
                                    type: 'POST',
                                    url: "http://" + host + "/cms/faultdiagnosis/characterUpdate",
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

