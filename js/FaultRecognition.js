let characterTable = [];
layui.use(['table', 'form'], function () {
    var table = layui.table
        , $ = layui.$
        , form = layui.form;

    table.render({
        elem: '#AddCharacter'
        , toolbar: '#AddToolbar'
        , defaultToolbar: []
        , height: 500
        , data: []
        , page: false //不开启分页
        , cols: [[ //表头
            { field: 'CharacterID', title: '序号', width: '10%', fixed: 'left', align: 'center' }
            , { field: 'CharacterName', title: '征兆名称', width: '60%', align: 'center' }
            , { field: 'Reliability', title: '置信度', edit: 'text', width: '15%', align: 'center' }
            , { title: '删除', width: '15%', templet: '#Delete', align: 'center' }
        ]]
    });

    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/character/list",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        success: function (res) {
            characterTable = res.data.data;
            console.log(characterTable.length, characterTable[0]);
        },
        error: function (res) {
            layer.msg("获取征兆列表失败");
        }
    });

    table.on('toolbar(AddCharacter)', function(obj){
        console.log(obj); // 查看对象所有成员
        
        // 根据不同的事件名进行相应的操作
        switch(obj.event){ // 对应模板元素中的 lay-event 属性值
            case 'add':
                layer.open({
                    type: 1,
                    area: ['640px', '480px'],
                    resize: false,
                    shadeClose: true,
                    title: '添加征兆',
                    content: `
                        <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
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
                                <label class="layui-form-label"><span class="layui-badge-dot"></span>置信度</label>
                                <div class="layui-input-block">
                                    <input type="text" name="Reliability" required lay-verify="required" placeholder="请输入输入框内容" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-row"  style="height: 175px;"></div>
                            <div class="layui-row">
                                <div class="layui-btn-container layui-col-md2 layui-col-md-offset10">
                                    <button class="layui-btn" style="margin: 0 auto;" lay-submit lay-filter="Management-submit">添加</button>
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

                        form.on('submit(Management-submit)', function (data) {
                            var field = data.field; // 获取表单字段值
                            console.log(field)
                            var CharacterID = parseInt(field.CharacterName);
                            var i;
                            for (i = 0; i < characterTable.length; i++) {
                                if (characterTable[i].CharacterID == CharacterID) {
                                    characterTable[i].Reliability = field.Reliability;
                                    break;
                                }
                            }
                            var j;
                            let tableDate = table.getData('AddCharacter');
                            for (j =0; j < tableDate.length; j++) {
                                if (tableDate[j].CharacterID == CharacterID) {
                                    tableDate[j].Reliability = field.Reliability;
                                    break;
                                }
                            }
                            if (j == tableDate.length) {
                                tableDate.push(characterTable[i]);
                            }
                            table.reload('AddCharacter', {
                                data: tableDate
                                , limit: tableDate.length
                            });
                            layer.closeAll('page');
                            return false; // 阻止默认 form 跳转
                        });
                    }
                });
            break;
        };
    });

    table.on('tool(AddCharacter)', function (obj) {
        var data = obj.data; // 得到当前行数据
        var index = obj.index; // 得到当前行索引
        var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
        var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
        var options = obj.config; // 获取当前表格基础属性配置项
        console.log(obj); // 查看对象所有成员

        // 根据 lay-event 的值执行不同操作
        if (layEvent === 'del') { //删除
            layer.confirm('确定删除吗？', function (index) {
                obj.del(); // 删除对应行（tr）的 DOM 结构，并更新缓存
                layer.close(index);
            });
        } 
    });

    table.render({
        elem: '#RecognitionResult'
        , toolbar: '#ResultToolbar'
        , defaultToolbar: []
        , height: 500
        , data: []
        , page: false //不开启分页
        , cols: [[ //表头
            { field: 'FaultID', title: '序号', width: '10%', fixed: 'left', align: 'center' }
            , { field: 'FaultName', title: '故障名称', width: '60%', align: 'center' }
            , { field: 'Reliability', title: '可信度', edit: 'text', width: '15%', align: 'center' }
            , { title: '详情', width: '15%', templet: '#Detail', align: 'center' }
        ]]
    });

    table.on('tool(RecognitionResult)', function (obj) {
        var data = obj.data; // 得到当前行数据
        var index = obj.index; // 得到当前行索引
        var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
        var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
        var options = obj.config; // 获取当前表格基础属性配置项
        console.log(obj); // 查看对象所有成员

        // 根据 lay-event 的值执行不同操作
        if (layEvent === 'detail') {
            layer.open({
                type: 1,
                area: '640px',
                resize: false,
                shadeClose: true,
                title: '故障详情',
                content: `
                    <form class="layui-form" lay-filter="Management-layer" style="margin: 16px; padding-right: 32px">
                        <div class="layui-form-item">
                            <label class="layui-form-label">序号</label>
                            <div class="layui-input-block">
                                <input type="text" name="FaultID" autocomplete="off" class="layui-input" disabled>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">故障名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="FaultName" autocomplete="off" class="layui-input" disabled>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">规则解释</label>
                            <div class="layui-input-block">
                                <input type="text" name="Explain" autocomplete="off" class="layui-input" disabled>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">可信度</label>
                            <div class="layui-input-block">
                                <input type="text" name="Reliability" autocomplete="off" class="layui-input" disabled>
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
        } 
    });
});

function StartRecognition() {
    layui.use(['table', 'form', 'layer'], function () {
        var table = layui.table
            , $ = layui.$
            , form = layui.form
            , layer = layui.layer;
        
        var data = table.getData("AddCharacter");
        if (data.length == 0) {
            layer.msg("请添加特征！");
            return;
        }
        let ReliabilityList = [];
        let CharacterIDList = [];
        var regPos = /^(\d+)(\.\d+)?$/; // 浮点数
        for (var i = 0; i < data.length; i++) {
            if ( regPos.test(data[i].Reliability) == false) {
                layer.msg("请输入数字！");
                return;
            }
            CharacterIDList.push(data[i].CharacterID);
            ReliabilityList.push(parseFloat(data[i].Reliability));
        }
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/character/recognition",
            contentType: "application/x-www-form-urlencoded",
            // async: false,
            dataType: "json",
            traditional: true,
            data: {
                CharacterIDList: CharacterIDList,
                ReliabilityList: ReliabilityList
            },
            success: function (res) {
                console.log(res.data);
                table.reload('RecognitionResult', {
                    data: res.data
                    , limit: res.data.length
                });
                layer.msg("诊断完成");
            },
            error: function (res) {
                console.log("AJAX ERROR");
            }
        });
    });
}