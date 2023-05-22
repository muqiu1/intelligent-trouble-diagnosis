layui.use(['table', 'laypage', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$

    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rule/list",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        success: function (res) {
            let data = res.data;
            console.log(data.data.length, data.data[0]);
            table.render({
                elem: '#RuleManagement'
                , toolbar: '#Toolbar'
                , data: data.data
                , limit: data.data.length
                , cols: [[ //表头
                    { field: 'RuleID', title: '序号', width: '7%', fixed: 'left', align: 'center'}
                    , { field: 'RuleName', title: '规则名称', width: '15%', align: 'center'}
                    , { field: 'IF', title: '规则前提', width: '20%', align: 'center'}
                    , { field: 'Then', title: '规则结论', width: '8%', align: 'center'}
                    , { field: 'Reliability', title: '可信度', width: '5%', align: 'center'}
                    , { field: 'Priority', title: '优先级', width: '5%', align: 'center'}
                    , { field: 'ActiveThre', title: '激活阈值', width: '7%', align: 'center'}
                    , { field: 'Explain', title: '规则解释', width: '13%', align: 'center'}
                    , { title: '操作', width: '12%', templet: '#Management', align: 'center' }
                    , { field: 'ActiveTimes', title: 'ActiveTimes', width: '8%', align: 'center'}
                ]]
            });

            table.on('toolbar(RuleManagement)', function(obj){
                console.log(obj); // 查看对象所有成员
                
                // 根据不同的事件名进行相应的操作
                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                    case 'add':
                        layer.open({
                            type: 1,
                            area: '640px',
                            resize: false,
                            shadeClose: true,
                            title: '新建规则',
                            content: `
                                <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="RuleName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则前提</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="IF" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则结论</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Then" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>可信度</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Reliability" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>优先级</label>
                                        <div class="layui-input-block">
                                            <input type="number" name="Priority" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>激活阈值</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="ActiveThre" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则解释</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Explain" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label" style="padding: 9px 0px; width: 110px;"><span class="layui-badge-dot"></span>ActiveTimes</label>
                                        <div class="layui-input-block">
                                            <input type="number" name="ActiveTimes" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
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
                                    console.log(field)
                                    // 此处可执行 Ajax 等操作
                                    $.ajax({
                                        type: 'POST',
                                        url: "http://" + host + "/cms/rule/add",
                                        data: field,
                                        contentType: "application/x-www-form-urlencoded",
                                        async: false,
                                        dataType: "json",
                                        success: function (res) {
                                            if (res.data == 1){
                                                layer.closeAll('page');
                                                layer.msg('新建成功');
                                                let tableDate = table.getData('RuleManagement');
                                                field.RuleID = parseInt(res.msg);
                                                tableDate.push(field);
                                                table.reload('RuleManagement', {
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

            table.on('tool(RuleManagement)', function (obj) {
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
                        title: '查看规则',
                        content: `
                            <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="RuleName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则前提</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="IF" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则结论</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Then" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>可信度</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Reliability" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>优先级</label>
                                    <div class="layui-input-block">
                                        <input type="number" name="Priority" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>激活阈值</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="ActiveThre" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则解释</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Explain" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label" style="padding: 9px 0px; width: 110px;"><span class="layui-badge-dot"></span>ActiveTimes</label>
                                    <div class="layui-input-block">
                                        <input type="number" name="ActiveTimes" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
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
                            url: "http://" + host + "/cms/rule/delete",
                            data: {
                                RuleID: obj.data.RuleID
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
                        title: '修改规则',
                        content: `
                            <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="RuleName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则前提</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="IF" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则结论</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Then" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>可信度</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Reliability" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>优先级</label>
                                    <div class="layui-input-block">
                                        <input type="number" name="Priority" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>激活阈值</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="ActiveThre" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则解释</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Explain" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label" style="padding: 9px 0px; width: 110px;"><span class="layui-badge-dot"></span>ActiveTimes</label>
                                    <div class="layui-input-block">
                                        <input type="number" name="ActiveTimes" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
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
                                field.RuleID = obj.data.RuleID;
                                // 此处可执行 Ajax 等操作
                                $.ajax({
                                    type: 'POST',
                                    url: "http://" + host + "/cms/rule/update",
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

