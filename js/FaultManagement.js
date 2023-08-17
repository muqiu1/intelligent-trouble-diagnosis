layui.use(['table', 'laypage', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$

    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/fault/list",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        success: function (res) {
            let data = res.data;
            FaultManagementList = data.data;
            table.render({
                elem: '#FaultManagement'
                , toolbar: '#FaultManagementtToolbar'
                , data: FaultManagementList
                , limit: 30
                , page: {
                    groups: 10,
                    prev: '<em><<</em>',
                    next: '<em>>></em>',
                    layout : ['count','prev', 'page', 'next','skip']
                }
                , even: true
                , cols: [[ //表头
                    { field: 'FaultID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                    , { field: 'FaultName', title: '故障名称', width: '15%', align: 'center'}
                    , { field: 'Detail', title: '故障描述', width: '20%', align: 'center'}
                    , { field: 'FaultType', title: '故障类型', width: '15%', align: 'center'}
                    , { field: 'FaultReason', title: '故障原因', width: '20%', align: 'center'}
                    , { title: '操作', width: '20%', templet: '#Management', align: 'center' }
                ]]
            });

            table.on('toolbar(FaultManagement)', function(obj){
                console.log(obj); // 查看对象所有成员
                
                // 根据不同的事件名进行相应的操作
                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                    case 'add':
                        layer.open({
                            type: 1,
                            area: '640px',
                            resize: false,
                            shadeClose: true,
                            title: '新建故障',
                            content: `
                                <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>故障名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="FaultName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">故障描述</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Detail"  autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>故障类型</label>
                                        <div class="layui-input-block">
                                            <select name="FaultType" required lay-verify="required">
                                                <option value="转子故障">转子故障</option>
                                                <option value="联轴器故障">联轴器故障</option>
                                                <option value="轴承故障">轴承故障</option>
                                                <option value="气路故障">气路故障</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">故障原因</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="FaultReason" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <button style="margin-left: 500px" class="layui-btn" lay-submit lay-filter="Management-submit">保存</button>
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
                                        url: "http://" + host + "/cms/fault/add",
                                        data: field,
                                        contentType: "application/x-www-form-urlencoded",
                                        async: false,
                                        dataType: "json",
                                        success: function (res) {
                                            if (res.data == 1){
                                                layer.closeAll('page');
                                                layer.msg('新建成功');
                                                field.FaultID = parseInt(res.msg);
                                                FaultManagementList.push(field);
                                                table.reload('FaultManagement', {
                                                    data: FaultManagementList,
                                                    page: {
                                                        curr: Math.ceil(FaultManagementList.length / 30)
                                                    }
                                                }, true);
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
                    case 'search':
                        let faultSearch = form.val("faultrManagementSearch");
                        let SearchFeild = faultSearch.SearchFeild;
                        let SearchContent = faultSearch.SearchContent;
                        if (SearchContent == "" || SearchContent == null) {
                            table.reload('FaultManagement', {
                                data: FaultManagementList,
                                page: {
                                    curr: 1,
                                }
                            }, true);
                            form.val("faultrManagementSearch", faultSearch);
                            return;
                        }
                        let searchResult = [];
                        for (let i = 0; i < FaultManagementList.length; i++) {
                            if ( new RegExp( SearchContent ).test( FaultManagementList[i][SearchFeild] ) ) {
                                searchResult.push(FaultManagementList[i]);
                            }
                        }
                        table.reload('FaultManagement', {
                            data: searchResult,
                            page: {
                                curr: 1,
                            }
                        }, true);
                        form.val("faultrManagementSearch", faultSearch);
                        break;
                };
            });

            table.on('tool(FaultManagement)', function (obj) {
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
                        title: '查看故障',
                        content: `
                            <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="FaultName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">故障描述</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Detail"  autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障类型</label>
                                    <div class="layui-input-block">
                                        <select name="FaultType" required lay-verify="required" disabled>
                                            <option value="转子故障">转子故障</option>
                                            <option value="联轴器故障">联轴器故障</option>
                                            <option value="轴承故障">轴承故障</option>
                                            <option value="气路故障">气路故障</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">故障原因</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="FaultReason" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>相关规则</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="RuleText" required lay-verify="required" placeholder="暂无相关规则" autocomplete="off" class="layui-input" disabled>
                                    </div>
                                </div>
                            </form>
                        `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("Management-layer", obj.data);
                            if (obj.data.RuleID != null && obj.data.RuleID != ''){
                                let RuleID = obj.data.RuleID.split(',');
                                let RuleText = [];
                                for (let i = 0; i < RuleID.length; i++) {
                                    for (let j = 0; j < RuleManagementList.length; j++) {
                                        if (RuleID[i] == RuleManagementList[j].RuleID) {
                                            RuleText.push(RuleManagementList[j].RuleName);
                                            break;
                                        }
                                    }
                                }
                                form.val("Management-layer", {RuleText : RuleText.join('；')});
                            }
                        }
                    });
                } else if (layEvent === 'del') { //删除
                    if (obj.data.RuleID != null && obj.data.RuleID != ""){
                        layer.alert('该故障有关联规则存在，请先解除关联规则！', {
                            icon: 2,
                            shadeClose: true,
                            title: '无法删除'
                        });
                        return;
                    }
                    layer.confirm('确定删除吗？', function (index) {
                        $.ajax({
                            type: 'POST',
                            url: "http://" + host + "/cms/fault/delete",
                            data: {
                                FaultID: obj.data.FaultID
                            },
                            contentType: "application/x-www-form-urlencoded",
                            async: false,
                            dataType: "json",
                            success: function (res) {
                                if (res.data == 1){
                                    obj.del(); // 删除对应行（tr）的 DOM 结构，并更新缓存
                                    var i;
                                    for (i = 0; i < FaultManagementList.length; i++) {
                                        if (FaultManagementList[i].FaultID == obj.data.FaultID) {
                                            break;
                                        }
                                    }
                                    FaultManagementList.splice(i, 1);
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
                        title: '修改故障',
                        content: `
                            <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="FaultName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">故障描述</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="Detail"  autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>故障类型</label>
                                    <div class="layui-input-block">
                                        <select name="FaultType" required lay-verify="required">
                                            <option value="转子故障">转子故障</option>
                                            <option value="联轴器故障">联轴器故障</option>
                                            <option value="轴承故障">轴承故障</option>
                                            <option value="气路故障">气路故障</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">故障原因</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="FaultReason" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <button style="margin-left: 500px" class="layui-btn" lay-submit lay-filter="Management-submit">保存</button>
                            </form>
                        `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("Management-layer", obj.data)
                            // 表单提交事件
                            form.on('submit(Management-submit)', function (data) {
                                var field = data.field; // 获取表单字段值
                                field.FaultID = obj.data.FaultID;
                                // 此处可执行 Ajax 等操作
                                $.ajax({
                                    type: 'POST',
                                    url: "http://" + host + "/cms/fault/update",
                                    data: field,
                                    contentType: "application/x-www-form-urlencoded",
                                    async: false,
                                    dataType: "json",
                                    success: function (res) {
                                        if (res.data == 1){
                                            layer.closeAll('page');
                                            obj.update(field);
                                            for (var i = 0; i < FaultManagementList.length; i++) {
                                                if (FaultManagementList[i].FaultID == obj.data.FaultID) {
                                                    FaultManagementList[i] = field;
                                                    break;
                                                }
                                            }
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

