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
                , toolbar: RightID != 3  ? '#Toolbar' : null
                , data: data.data
                , limit: data.data.length
                , even: true
                , cols: [[ //表头
                    { field: 'RuleID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                    , { field: 'RuleName', title: '规则名称', width: '25%', align: 'center'}
                    , { field: 'Reliability', title: '可信度', width: '9%', align: 'center'}
                    , { field: 'Priority', title: '优先级', width: '9%', align: 'center'}
                    , { field: 'ActiveThre', title: '激活阈值', width: '7%', align: 'center'}
                    , { field: 'Explain', title: '规则解释', width: '20%', align: 'center'}
                    , { title: '操作', width: '20%', templet: '#Management', align: 'center' }
                ]]
            });

            table.on('toolbar(RuleManagement)', function(obj){
                console.log(obj); // 查看对象所有成员
                
                // 根据不同的事件名进行相应的操作
                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                    case 'add':
                        layer.open({
                            type: 1,
                            area: '750px',
                            resize: false,
                            shadeClose: true,
                            title: '新建规则',
                            content: `
                                <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px" onsubmit="return false">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="RuleName" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item" style="margin-bottom: 0px">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则前提</label>
                                    </div>
                                    <div class="layui-row">
                                        <table id="IFList" lay-filter="IFList"></table>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline" style="width: 80%;">
                                            <label class="layui-form-label"><span class="layui-badge-dot"></span>规则结论</label>
                                            <div class="layui-input-inline" style="width: 300px;">
                                                <input type="text" name="ThenName" lay-verify="required" placeholder="请选择" autocomplete="off" class="layui-input" disabled>
                                            </div>
                                        </div>
                                        <div class="layui-inline" style="width: 50px;">
                                            <div class="layui-input-inline">
                                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick=changeThen()>选择</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>可信度</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Reliability" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>优先级</label>
                                        <div class="layui-input-block">
                                            <input type="number" name="Priority" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>激活阈值</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="ActiveThre" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则解释</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="Explain" lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <button style="margin-left: 600px" class="layui-btn" lay-submit lay-filter="Management-submit">保存</button>
                                </form>
                              `,
                            success: function () {
                                // 对弹层中的表单进行初始化渲染
                                form.render();
                                table.render({
                                    elem: '#IFList'
                                    , toolbar: '#IFListToolbar'
                                    , defaultToolbar: []
                                    , even: true
                                    , height: 200
                                    , data: []
                                    , page: false //不开启分页
                                    , cols: [[ //表头
                                        { field: 'CharacterID', title: '序号', width: '30%', fixed: 'left', align: 'center' }
                                        , { field: 'CharacterName', title: '征兆名称', width: '30%', align: 'center' }
                                        , { field: 'Weight', title: '权重', width: '30%', align: 'center' }
                                        , { title: '删除', width: '10%', templet: '#IFListDelete', align: 'center' }
                                    ]]
                                });
                                table.on('toolbar(IFList)', function(obj){
                                    var characterTable = table.getData('CharacterManagement');
                                    // 根据不同的事件名进行相应的操作
                                    switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                                        case 'add':
                                            var index = layer.open({
                                                type: 1,
                                                area: ['640px', '480px'],
                                                resize: false,
                                                shadeClose: true,
                                                title: '添加征兆',
                                                content: `
                                                    <form class="layui-form" lay-filter="CharacterAdd-layer" style="margin: 16px; padding-right: 32px">
                                                        <div class="layui-form-item">
                                                            <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆类型</label>
                                                            <div class="layui-input-block">
                                                                <select name="CharacterType" lay-filter="CharacterType" required lay-verify="required">
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
                                                            <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆名称</label>
                                                            <div class="layui-input-block">
                                                                <select name="CharacterName" required lay-verify="required">
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="layui-form-item">
                                                            <label class="layui-form-label"><span class="layui-badge-dot"></span>权重</label>
                                                            <div class="layui-input-block">
                                                                <input type="text" name="Weight" required lay-verify="required|Weight" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                                            </div>
                                                        </div>
                                                        <div class="layui-row"  style="height: 175px;"></div>
                                                        <div class="layui-row">
                                                            <div class="layui-btn-container layui-col-md2 layui-col-md-offset10">
                                                                <button class="layui-btn" style="margin: 0 auto;" lay-submit lay-filter="CharacterAdd-submit">添加</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                  `,
                                                success: function () {
                                                    // 对弹层中的表单进行初始化渲染
                                                    var slct = document.getElementsByName("CharacterName");
                                                    for (var k = 0; k < slct.length; k++) {
                                                        for (var i = 0; i < characterTable.length; i++) {
                                                            if (characterTable[i].CharacterType != 0) continue;
                                                            var op = document.createElement("option")
                                                            op.setAttribute('value', characterTable[i].CharacterID)
                                                            op.innerHTML = characterTable[i].CharacterName;
                                                            slct[k].appendChild(op)
                                                        }
                                                    }
                                                    form.render('select');
                                                    form.verify({
                                                        // 函数写法
                                                        // 参数 value 为表单的值；参数 item 为表单的 DOM 对象
                                                        Weight: function (value, item) {
                                                            if (!new RegExp("^[0-1]+(.[0-9]+)?$").test(value)) {
                                                                return '权重应在0到1之间';
                                                            }
                                                            var num = parseFloat(value);
                                                            if (num < 0 || num > 1 ) {
                                                                return '权重度应在0到1之间';
                                                            }
                                                        },
                                                    });
                            
                                                    // 表单提交事件
                                                    form.on('select(CharacterType)', function (data) {
                                                        var type = parseInt(data.value);
                                                        var slct = document.getElementsByName("CharacterName");
                                                        for (var k = 0; k < slct.length; k++) {
                                                            slct[k].innerHTML = "";
                                                            for (var i = 0; i < characterTable.length; i++) {
                                                                if (characterTable[i].CharacterType != type) continue;
                                                                var op = document.createElement("option")
                                                                op.setAttribute('value', characterTable[i].CharacterID)
                                                                op.innerHTML = characterTable[i].CharacterName;
                                                                slct[k].appendChild(op)
                                                            }
                                                        }
                                                        form.render('select');
                                                    });
                            
                                                    form.on('submit(CharacterAdd-submit)', function (data) {
                                                        var field = data.field; // 获取表单字段值
                                                        let tableDate = table.getData('IFList');
                                                        var CharacterID = parseInt(field.CharacterName);
                                                        var i;
                                                        for (i = 0; i < characterTable.length; i++) {
                                                            if (characterTable[i].CharacterID == CharacterID) {
                                                                characterTable[i].Weight = field.Weight;
                                                                break;
                                                            }
                                                        }
                                                        var j;
                                                        for (j =0; j < tableDate.length; j++) {
                                                            if (tableDate[j].CharacterID == CharacterID) {
                                                                tableDate[j].Weight = field.Weight;
                                                                break;
                                                            }
                                                        }
                                                        if (j == tableDate.length) {
                                                            tableDate.push(characterTable[i]);
                                                        }
                                                        table.reload('IFList', {
                                                            data: tableDate
                                                            , limit: tableDate.length
                                                        });
                                                        layer.close(index);
                                                        return false; // 阻止默认 form 跳转
                                                    });
                                                }
                                            });
                                        break;
                                    };
                                });
                                table.on('tool(IFList)', function (obj) {
                                    var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
                                    // 根据 lay-event 的值执行不同操作
                                    if (layEvent === 'del') { //删除
                                        layer.confirm('确定删除吗？', function (index) {
                                            obj.del(); // 删除对应行（tr）的 DOM 结构，并更新缓存
                                            layer.close(index);
                                        });
                                    } 
                                });
                                // 表单提交事件
                                form.on('submit(Management-submit)', function (data) {
                                    var field = data.field; // 获取表单字段值
                                    let IFList = table.getData('IFList');
                                    if (IFList.length == 0) {
                                        layer.msg('请先添加规则前提', { icon: 5 });
                                        return false;
                                    }
                                    var sum = 0;
                                    for (var i = 0; i < IFList.length; i++) {
                                        sum += parseFloat(IFList[i].Weight);
                                    }
                                    if (Math.abs(sum - 1) > 0.000001) {
                                        layer.msg('权重之和应等于1', { icon: 5 });
                                        return false;
                                    }
                                    let IFListText = IFList.map(function (item) { return item.CharacterID + "," + item.Weight; }).join(";");
                                    field.IF = IFListText;
                                    field.Then = field.ThenName.split(":")[0];
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
                                                updateCharacterTable(field, "");
                                                updateFaultTable(field, "");
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
                var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
                // console.log(obj); // 查看对象所有成员

                // 根据 lay-event 的值执行不同操作
                if (layEvent === 'detail') { //查看
                    layer.open({
                        type: 1,
                        area: '750px',
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
                                <div class="layui-form-item" style="margin-bottom: 0px">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则前提</label>
                                </div>
                                <div class="layui-row">
                                    <table id="IFList" lay-filter="IFList"></table>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则结论</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="ThenName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input" disabled>
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
                            </form>
                        `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("Management-layer", obj.data);
                            let IF = obj.data.IF.split(';');
                            let characterTable = table.getData('CharacterManagement');
                            let IFList = [];
                            for (let i = 0; i < IF.length; i++) {
                                let CharacterID = IF[i].split(',')[0];
                                for (let j = 0; j < characterTable.length; j++) {
                                    if (CharacterID == characterTable[j].CharacterID) {
                                        characterTable[j].Weight = parseFloat(IF[i].split(',')[1]);
                                        IFList.push(characterTable[j]);
                                        break;
                                    }
                                }
                            }
                            table.render({
                                elem: '#IFList'
                                , defaultToolbar: []
                                , height: 200
                                , data: IFList
                                , limit: IFList.length
                                , even: true
                                , page: false //不开启分页
                                , cols: [[ //表头
                                    { field: 'CharacterID', title: '序号', width: '30%', fixed: 'left', align: 'center' }
                                    , { field: 'CharacterName', title: '征兆名称', width: '40%', align: 'center' }
                                    , { field: 'Weight', title: '权重', width: '30%', align: 'center' }
                                ]]
                            });
                            let Then = obj.data.Then;
                            let FaultList = table.getData('FaultManagement');
                            let ThenName;
                            for (let i = 0; i < FaultList.length; i++) {
                                if (Then == FaultList[i].FaultID) {
                                    ThenName = FaultList[i].FaultID + ':' + FaultList[i].FaultName;
                                    break;
                                }
                            }
                            form.val("Management-layer", {ThenName : ThenName});
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
                                    let IF_old = obj.data.IF;
                                    let Then_old = obj.data.Then;
                                    obj.del(); // 删除对应行（tr）的 DOM 结构，并更新缓存
                                    layer.msg('删除成功');
                                    obj.data.IF = "";
                                    obj.data.Then = "";
                                    updateCharacterTable(obj.data, IF_old);
                                    updateFaultTable(obj.data, Then_old);
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
                        title: '修改规则',
                        content: `
                            <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px" onsubmit="return false">
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="RuleName" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item" style="margin-bottom: 0px">
                                    <label class="layui-form-label"><span class="layui-badge-dot"></span>规则前提</label>
                                </div>
                                <div class="layui-row">
                                    <table id="IFList" lay-filter="IFList"></table>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-inline" style="width: 80%;">
                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>规则结论</label>
                                        <div class="layui-input-inline" style="width: 300px;">
                                            <input type="text" name="ThenName" lay-verify="required" placeholder="请选择" autocomplete="off" class="layui-input" disabled>
                                        </div>
                                    </div>
                                    <div class="layui-inline" style="width: 50px;">
                                        <div class="layui-input-inline">
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick=changeThen()>选择</button>
                                        </div>
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
                                <button style="margin-left: 600px" class="layui-btn" lay-submit lay-filter="Management-submit">保存</button>
                            </form>
                        `,
                        success: function () {
                            // 对弹层中的表单进行初始化渲染
                            form.render();
                            form.val("Management-layer", obj.data)
                            let IF = obj.data.IF.split(';');
                            let characterTable = table.getData('CharacterManagement');
                            let IFList = [];
                            for (let i = 0; i < IF.length; i++) {
                                let CharacterID = IF[i].split(',')[0];
                                for (let j = 0; j < characterTable.length; j++) {
                                    if (CharacterID == characterTable[j].CharacterID) {
                                        characterTable[j].Weight = parseFloat(IF[i].split(',')[1]);
                                        IFList.push(characterTable[j]);
                                        break;
                                    }
                                }
                            }
                            table.render({
                                elem: '#IFList'
                                , toolbar: '#IFListToolbar'
                                , defaultToolbar: []
                                , height: 200
                                , data: IFList
                                , limit: IFList.length
                                , even: true
                                , page: false //不开启分页
                                , cols: [[ //表头
                                    { field: 'CharacterID', title: '序号', width: '30%', fixed: 'left', align: 'center' }
                                    , { field: 'CharacterName', title: '征兆名称', width: '30%', align: 'center' }
                                    , { field: 'Weight', title: '权重', width: '30%', align: 'center' }
                                    , { title: '删除', width: '10%', templet: '#IFListDelete', align: 'center' }
                                ]]
                            });
                            let Then = obj.data.Then;
                            let FaultList = table.getData('FaultManagement');
                            let ThenName;
                            for (let i = 0; i < FaultList.length; i++) {
                                if (Then == FaultList[i].FaultID) {
                                    ThenName = FaultList[i].FaultID + ':' + FaultList[i].FaultName;
                                    break;
                                }
                            }
                            form.val("Management-layer", {ThenName : ThenName});

                            table.on('toolbar(IFList)', function(obj){
                                var characterTable = table.getData('CharacterManagement');
                                // 根据不同的事件名进行相应的操作
                                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                                    case 'add':
                                        var index = layer.open({
                                            type: 1,
                                            area: ['640px', '480px'],
                                            resize: false,
                                            shadeClose: true,
                                            title: '添加征兆',
                                            content: `
                                                <form class="layui-form" lay-filter="CharacterAdd-layer" style="margin: 16px; padding-right: 32px">
                                                    <div class="layui-form-item">
                                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆类型</label>
                                                        <div class="layui-input-block">
                                                            <select name="CharacterType" lay-filter="CharacterType" required lay-verify="required">
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
                                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>征兆名称</label>
                                                        <div class="layui-input-block">
                                                            <select name="CharacterName" required lay-verify="required">
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="layui-form-item">
                                                        <label class="layui-form-label"><span class="layui-badge-dot"></span>权重</label>
                                                        <div class="layui-input-block">
                                                            <input type="text" name="Weight" required lay-verify="required|Weight" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                                        </div>
                                                    </div>
                                                    <div class="layui-row"  style="height: 175px;"></div>
                                                    <div class="layui-row">
                                                        <div class="layui-btn-container layui-col-md2 layui-col-md-offset10">
                                                            <button class="layui-btn" style="margin: 0 auto;" lay-submit lay-filter="CharacterAdd-submit">添加</button>
                                                        </div>
                                                    </div>
                                                </form>
                                              `,
                                            success: function () {
                                                // 对弹层中的表单进行初始化渲染
                                                var slct = document.getElementsByName("CharacterName");
                                                for (var k = 0; k < slct.length; k++) {
                                                    for (var i = 0; i < characterTable.length; i++) {
                                                        if (characterTable[i].CharacterType != 0) continue;
                                                        var op = document.createElement("option")
                                                        op.setAttribute('value', characterTable[i].CharacterID)
                                                        op.innerHTML = characterTable[i].CharacterName;
                                                        slct[k].appendChild(op)
                                                    }
                                                }
                                                form.render('select');
                                                form.verify({
                                                    // 函数写法
                                                    // 参数 value 为表单的值；参数 item 为表单的 DOM 对象
                                                    Weight: function (value, item) {
                                                        if (!new RegExp("^[0-1]+(.[0-9]+)?$").test(value)) {
                                                            return '权重应在0到1之间';
                                                        }
                                                        var num = parseFloat(value);
                                                        if (num < 0 || num > 1 ) {
                                                            return '权重度应在0到1之间';
                                                        }
                                                    },
                                                });
                        
                                                // 表单提交事件
                                                form.on('select(CharacterType)', function (data) {
                                                    var type = parseInt(data.value);
                                                    var slct = document.getElementsByName("CharacterName");
                                                    for (var k = 0; k < slct.length; k++) {
                                                        slct[k].innerHTML = "";
                                                        for (var i = 0; i < characterTable.length; i++) {
                                                            if (characterTable[i].CharacterType != type) continue;
                                                            var op = document.createElement("option")
                                                            op.setAttribute('value', characterTable[i].CharacterID)
                                                            op.innerHTML = characterTable[i].CharacterName;
                                                            slct[k].appendChild(op)
                                                        }
                                                    }
                                                    form.render('select');
                                                });
                        
                                                form.on('submit(CharacterAdd-submit)', function (data) {
                                                    var field = data.field; // 获取表单字段值
                                                    let tableDate = table.getData('IFList');
                                                    var CharacterID = parseInt(field.CharacterName);
                                                    var i;
                                                    for (i = 0; i < characterTable.length; i++) {
                                                        if (characterTable[i].CharacterID == CharacterID) {
                                                            characterTable[i].Weight = field.Weight;
                                                            break;
                                                        }
                                                    }
                                                    var j;
                                                    for (j =0; j < tableDate.length; j++) {
                                                        if (tableDate[j].CharacterID == CharacterID) {
                                                            tableDate[j].Weight = field.Weight;
                                                            break;
                                                        }
                                                    }
                                                    if (j == tableDate.length) {
                                                        tableDate.push(characterTable[i]);
                                                    }
                                                    table.reload('IFList', {
                                                        data: tableDate
                                                        , limit: tableDate.length
                                                    });
                                                    layer.close(index);
                                                    return false; // 阻止默认 form 跳转
                                                });
                                            }
                                        });
                                    break;
                                };
                            });
                            table.on('tool(IFList)', function (obj) {
                                var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
                                // 根据 lay-event 的值执行不同操作
                                if (layEvent === 'del') { //删除
                                    layer.confirm('确定删除吗？', function (index) {
                                        obj.del(); // 删除对应行（tr）的 DOM 结构，并更新缓存
                                        layer.close(index);
                                    });
                                } 
                            });

                            // 表单提交事件
                            form.on('submit(Management-submit)', function (data) {
                                var field = data.field; // 获取表单字段值
                                field.RuleID = obj.data.RuleID;
                                let IFList = table.getData('IFList');
                                if (IFList.length == 0) {
                                    layer.msg('请先添加规则前提', { icon: 5 });
                                    return false;
                                }
                                var sum = 0;
                                for (var i = 0; i < IFList.length; i++) {
                                    sum += parseFloat(IFList[i].Weight);
                                }
                                if (Math.abs(sum - 1) > 0.000001) {
                                    layer.msg('权重之和应等于1', { icon: 5 });
                                    return false;
                                }
                                let IFListText = IFList.map(function (item) { return item.CharacterID + "," + item.Weight; }).join(";");
                                let IF_old = obj.data.IF;
                                let Then_old = obj.data.Then;
                                field.IF = IFListText;
                                field.Then = field.ThenName.split(":")[0];
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
                                            updateCharacterTable(field, IF_old);
                                            updateFaultTable(field, Then_old);
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

function changeThen(){
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
            title: '选择规则结论',
            content: `
                <div class="layui-row">
                    <table id="ThenTable" lay-filter="ThenTable"></table>
                </div>
            `,
            success: function () {
                var FaultTable = table.getData('FaultManagement');
                // 对弹层中的表单进行初始化渲染
                table.render({
                    elem: '#ThenTable'
                    , data: FaultTable
                    , limit: FaultTable.length
                    , even: true
                    , cols: [[ //表头
                        { title: '选择', width: '30%', type: 'radio', align: 'center'  }
                        , { field: 'FaultID', title: '序号', width: '30%',  align: 'center' }
                        , { field: 'FaultName', title: '名称', width: '40%', align: 'center'  }
                    ]]
                });
                // 单选框事件
                table.on('radio(ThenTable)', function(Fault){
                    form.val("Management-layer", {
                        ThenName: Fault.data.FaultID + ':' + Fault.data.FaultName,
                    });
                    layer.close(index2);
                });
                table.on('rowDouble(ThenTable)', function(Fault){
                    form.val("Management-layer", {
                        ThenName: Fault.data.FaultID + ':' + Fault.data.FaultName,
                    });
                    layer.close(index2);
                });
            }
        });
        return false;
    });
}

function updateFaultTable(field, Then_old){
    layui.use(['table'], function () {
        var table = layui.table
            , $ = layui.$;
        if (field.Then != Then_old) {
            var FaultTable = table.getData('FaultManagement');
            for (var i = 0; i < FaultTable.length; i++) {
                if (FaultTable[i].FaultID == field.Then) {
                    if ( FaultTable[i].RuleID == null || FaultTable[i].RuleID == ''){
                        FaultTable[i].RuleID = String(field.RuleID);
                    }
                    else{
                        let RuleIDList = FaultTable[i].RuleID.split(',');
                        RuleIDList.push(String(field.RuleID));
                        RuleIDList.sort();
                        FaultTable[i].RuleID = RuleIDList.join(',');
                    }
                    $.ajax({
                        type: 'POST',
                        url: "http://" + host + "/cms/fault/update",
                        data: {
                            FaultID: FaultTable[i].FaultID,
                            FaultName: FaultTable[i].FaultName,
                            RuleID: FaultTable[i].RuleID
                        },
                        contentType: "application/x-www-form-urlencoded",
                        async: false,
                        dataType: "json",
                        success: function (res) {
                            if (res.data == 1){
                            }
                            else {
                                layer.msg('联动修改fault失败: ' + FaultTable[i].FaultID);
                            }
                        },
                        error: function () {
                            layer.msg('联动修改fault失败: ' + FaultTable[i].FaultID);
                        }
                    });
                    break;
                }
            }
            if (Then_old != null && Then_old != ''){
                for (var i = 0; i < FaultTable.length; i++) {
                    if (FaultTable[i].FaultID == Then_old) {
                        let RuleIDList = FaultTable[i].RuleID.split(',');
                        var index = RuleIDList.indexOf(String(field.RuleID));
                        if (index > -1) {
                            RuleIDList.splice(index, 1);
                        }
                        FaultTable[i].RuleID = RuleIDList.join(',');
                        $.ajax({
                            type: 'POST',
                            url: "http://" + host + "/cms/fault/update",
                            data: {
                                FaultID: FaultTable[i].FaultID,
                                FaultName: FaultTable[i].FaultName,
                                RuleID: FaultTable[i].RuleID  == '' ? "null" : FaultTable[i].RuleID
                            },
                            contentType: "application/x-www-form-urlencoded",
                            async: false,
                            dataType: "json",
                            success: function (res) {
                                if (res.data == 1){
                                }
                                else {
                                    layer.msg('联动修改fault失败: ' + FaultTable[i].FaultID);
                                }
                            },
                            error: function () {
                                layer.msg('联动修改fault失败: ' + FaultTable[i].FaultID);
                            }
                        });
                        break;
                    }
                }
            }
            table.reload('FaultManagement', {
                data: FaultTable
            });
        }
    });
}

function updateCharacterTable(field, IF_old){
    layui.use(['table'], function () {
        var table = layui.table
            , $ = layui.$;
        let IFList = field.IF.split(';').map( x => parseInt(x.split(',')[0]));
        let IFList_old = IF_old.split(';').map( x => parseInt(x.split(',')[0]));
        let IFList_add = IFList.filter(x => !IFList_old.includes(x));
        let IFList_del = IFList_old.filter(x => !IFList.includes(x));
        console.log(IFList_add, IFList_del);
        var CharacterTable = table.getData('CharacterManagement');
        for (var i = 0; i < CharacterTable.length; i++) {
            if (IFList_add.includes(CharacterTable[i].CharacterID)) {
                if (CharacterTable[i].RuleID == null || CharacterTable[i].RuleID == ''){
                    CharacterTable[i].RuleID = String(field.RuleID);
                }
                else{
                    let RuleIDList = CharacterTable[i].RuleID.split(',');
                    RuleIDList.push(String(field.RuleID));
                    RuleIDList.sort();
                    CharacterTable[i].RuleID = RuleIDList.join(',');
                }
                $.ajax({
                    type: 'POST',
                    url: "http://" + host + "/cms/character/update",
                    data: {
                        CharacterID: CharacterTable[i].CharacterID,
                        CharacterName: CharacterTable[i].CharacterName,
                        RuleID: CharacterTable[i].RuleID
                    },
                    contentType: "application/x-www-form-urlencoded",
                    async: false,
                    dataType: "json",
                    success: function (res) {
                        if (res.data == 1){
                        }
                        else {
                            layer.msg('联动修改character失败: ' + CharacterTable[i].CharacterID);
                        }
                    },
                    error: function () {
                        layer.msg('联动修改character失败: ' + CharacterTable[i].CharacterID);
                    }
                });
            }
            if (IFList_del.includes(CharacterTable[i].CharacterID)) {
                let RuleIDList = CharacterTable[i].RuleID.split(',');
                var index = RuleIDList.indexOf(String(field.RuleID));
                if (index > -1) {
                    RuleIDList.splice(index, 1);
                }
                CharacterTable[i].RuleID = RuleIDList.join(',');
                $.ajax({
                    type: 'POST',
                    url: "http://" + host + "/cms/character/update",
                    data: {
                        CharacterID: CharacterTable[i].CharacterID,
                        CharacterName: CharacterTable[i].CharacterName,
                        RuleID: CharacterTable[i].RuleID == '' ? "null" : CharacterTable[i].RuleID
                    },
                    contentType: "application/x-www-form-urlencoded",
                    async: false,
                    dataType: "json",
                    success: function (res) {
                        if (res.data == 1){
                        }
                        else {
                            layer.msg('联动修改character失败: ' + CharacterTable[i].CharacterID);
                        }
                    },
                    error: function () {
                        layer.msg('联动修改character失败: ' + CharacterTable[i].CharacterID);
                    }
                });
            }
        }
        table.reload('CharacterManagement', {
            data: CharacterTable
        });
    });
}