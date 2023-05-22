var UserData = []
var rightRule = { 1: "超级管理员", 2: "一般管理员", 3: "浏览人员" }
layui.use(['table', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$;
    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/user/list",
        contentType: "application/json",
        async: false,
        dataType: "json",
        data: {},
        success: function (data) {
            let Userlist = data.data.list
            //第一个实例
            table.render({
                elem: '#UserManagement'
                , data: Userlist
                , toolbar: '#UserManagementToolbar'
                , defaultToolbar: []
                , cols: [[ //表头
                    { field: 'UserID', title: '账号', width: '20%' }
                    , { field: 'UserName', title: '姓名', width: '15%' }
                    , { field: 'UserZW', title: '职务', width: '20%' }
                    , { field: 'RightID', title: '权限', width: '15%', templet: function(d){ return '<span>'+rightRule[d.RightID]+'</span>' } }
                    , { field: 'Describe', title: '备注', width: '15%' }
                    , { title: '操作', width: 200, align: 'center', toolbar: '#UserManagementBar', width: '15%' }
                ]]
            });

            table.on('toolbar(UserManagement)', function(obj){
                console.log(obj); // 查看对象所有成员
                
                // 根据不同的事件名进行相应的操作
                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                    case 'add':
                        layer.open({
                            type: 1,
                            area: '640px',
                            resize: false,
                            shadeClose: true,
                            title: '新建账号',
                            content: `
                            <form class="layui-form" lay-filter="UserAddLayer" action="">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">账号</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="UserID" required lay-verify="required" placeholder="请输入账号" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">姓名</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="UserName" required lay-verify="required" placeholder="请输入姓名" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">密码</label>
                                    <div class="layui-input-block">
                                        <input type="password" name="PWD" required lay-verify="required" placeholder="请输入密码" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">职务</label>
                                    <div class="layui-input-block">
                                        <select name="UserZW" required lay-verify="required">
                                            <option value="分析员">分析员</option>
                                            <option value="销售员">销售员</option>
                                            <option value="采购员" selected>采购员</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">角色</label>
                                    <div class="layui-input-block">
                                        <select name="RightID" required lay-verify="required">
                                            <option value=1>超级管理员</option>
                                            <option value=2>一般管理员</option>
                                            <option value=3 selected>浏览人员</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item layui-form-text">
                                    <label class="layui-form-label">备注</label>
                                    <div class="layui-input-block">
                                        <textarea name="Describe" placeholder="请输入内容" class="layui-textarea"></textarea>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-input-block">
                                        <button class="layui-btn" lay-submit lay-filter="UserAddSubmit">提交</button>
                                    </div>
                                </div>
                            </form>
                              `,
                            success: function () {
                                // 对弹层中的表单进行初始化渲染
                                form.render('select');
                                // 表单提交事件
                                form.on('submit(UserAddSubmit)', function (data) {
                                    var field = data.field;
                                    field.RightID = parseInt(field.RightID);
                                    // 此处可执行 Ajax 等操作
                                    $.ajax({
                                        type: 'POST',
                                        url: "http://" + host + "/cms/user/add",
                                        data: field,
                                        contentType: "application/x-www-form-urlencoded",
                                        async: false,
                                        dataType: "json",
                                        success: function (res) {
                                            if (res.data == 1){
                                                layer.closeAll('page');
                                                layer.msg('新建成功');
                                                let tableDate = table.getData('UserManagement');
                                                tableDate.push(field);
                                                table.reload('UserManagement', {
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

            table.on('tool(UserManagement)', function (obj) {
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
                            url: "http://" + host + "/cms/user/delete",
                            data: {
                                UserID: obj.data.UserID
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
                        title: '修改账号',
                        content: `
                            <form class="layui-form" lay-filter="UserEditLayer" action="">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">账号</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="UserID" required lay-verify="required" placeholder="请输入账号" class="layui-input" disabled>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">姓名</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="UserName" required lay-verify="required" placeholder="请输入姓名" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">密码</label>
                                    <div class="layui-input-block">
                                        <input type="password" name="PWD" placeholder="" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">职务</label>
                                    <div class="layui-input-block">
                                        <select name="UserZW" required lay-verify="required">
                                            <option value="分析员">分析员</option>
                                            <option value="销售员">销售员</option>
                                            <option value="采购员">采购员</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">角色</label>
                                    <div class="layui-input-block">
                                        <select name="RightID" required lay-verify="required">
                                            <option value=1>超级管理员</option>
                                            <option value=2>一般管理员</option>
                                            <option value=3>浏览人员</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-form-item layui-form-text">
                                    <label class="layui-form-label">备注</label>
                                    <div class="layui-input-block">
                                        <textarea name="Describe" placeholder="请输入内容" class="layui-textarea"></textarea>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-input-block">
                                        <button class="layui-btn" lay-submit lay-filter="UserEditSubmit">提交</button>
                                    </div>
                                </div>
                            </form>
                          `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("UserEditLayer", obj.data)
                            // 表单提交事件
                            form.on('submit(UserEditSubmit)', function (data) {
                                var field = data.field; // 获取表单字段值
                                field.UserID = obj.data.UserID
                                // 此处可执行 Ajax 等操作
                                $.ajax({
                                    type: 'POST',
                                    url: "http://" + host + "/cms/user/update",
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