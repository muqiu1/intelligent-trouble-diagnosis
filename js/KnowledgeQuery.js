layui.use(['table', 'laypage', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$
    
    let characterList = [];
    let faultList = [];
    let ruleList = [];
    $.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/character/list",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        success: function (res) {
            let data = res.data;
            console.log(data.data.length, data.data[0]);
            characterList = data.data;
            let characterDict = {};
            for (let i = 0; i < characterList.length; i++) {
                characterDict[characterList[i].CharacterID] = characterList[i].CharacterName;
            }
            $.ajax({
                type: 'POST',
                url: "http://" + host + "/cms/fault/list",
                data: {},
                contentType: "application/x-www-form-urlencoded",
                // async: false,
                dataType: "json",
                success: function (res) {
                    let data = res.data;
                    console.log(data.data.length, data.data[0]);
                    faultList = data.data;
                    let faultDict = {};
                    for (let i = 0; i < faultList.length; i++) {
                        faultDict[faultList[i].FaultID] = faultList[i].FaultName;
                    }
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
                            ruleList = data.data;
                            let ruleDict = {};
                            for (let i = 0; i < ruleList.length; i++) {
                                ruleDict[ruleList[i].RuleID] = ruleList[i].RuleName;
                            }

                            // 绘制表格
                            $.ajax({
                                type: 'POST',
                                url: "http://" + host + "/cms/character/typeList",
                                data: {},
                                contentType: "application/x-www-form-urlencoded",
                                // async: false,
                                dataType: "json",
                                success: function (res) {
                                    let data = res.data;
                                    let characterTypeList = data.data;
                                    let characterTypeDict = {};
                                    for (let i = 0; i < characterTypeList.length; i++) {
                                        characterTypeDict[characterTypeList[i].CharacterType] = characterTypeList[i].CharacterTypeName;
                                    }
                                    for (let i = 0; i < characterList.length; i++) {
                                        characterList[i].CharacterTypeName = characterTypeDict[characterList[i].CharacterType];
                                        characterList[i].RuleName = characterList[i].RuleID == null ? "" : characterList[i].RuleID.split(',').map( x => ruleDict[parseInt(x)]).join("；");
                                    }
                                    table.render({
                                        elem: '#character'
                                        , data: characterList
                                        , limit: 30
                                        , page: {
                                            groups: 10,
                                            prev: '<em><<</em>',
                                            next: '<em>>></em>',
                                            layout : ['count','prev', 'page', 'next','skip']
                                        }
                                        , toolbar: `
                                                    <div>
                                                        <form class="layui-form" lay-filter="characterSearch" onsubmit="return false">
                                                            <div class="layui-form-item" style="margin-bottom: 0px">
                                                                <div class="layui-inline" style="margin-bottom: 0px">
                                                                    <label class="layui-form-label">搜索字段</label>
                                                                    <div class="layui-input-inline">
                                                                        <select name="SearchFeild">
                                                                            <option value="CharacterName" selected>征兆名称</option>
                                                                            <option value="CharacterID">序号</option>
                                                                            <option value="CharacterTypeName">征兆类型</option>
                                                                            <option value="Detail">征兆描述</option>
                                                                            <option value="RuleName">相关规则</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="layui-inline" style="margin-bottom: 0px">
                                                                    <label class="layui-form-label" style="width: auto;">搜索内容</label>
                                                                    <div class="layui-input-inline">
                                                                        <input type="text" name="SearchContent" autocomplete="off" class="layui-input">
                                                                    </div>
                                                                </div>
                                                                <div class="layui-inline" style="margin-bottom: 0px">
                                                                    <div class="layui-input-inline">
                                                                        <button class="layui-btn layui-btn-sm" lay-event="search">搜索</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    `
                                        , even: true
                                        , cols: [[ //表头
                                            { field: 'CharacterID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                                            , { field: 'CharacterName', title: '征兆名称', width: '20%', align: 'center'}
                                            , { field: 'CharacterTypeName', title: '征兆类型', width: '10%', align: 'center'}
                                            , { field: 'Detail', title: '征兆描述', width: '45%', align: 'center'}
                                            , { field: 'RuleName', title: '相关规则', width: '15%', align: 'center'}
                                        ]]
                                    });
                                    table.on('toolbar(character)', function (obj) {
                                        switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                                            case 'search':
                                                let characterSearch = form.val("characterSearch");
                                                let SearchFeild = characterSearch.SearchFeild;
                                                let SearchContent = characterSearch.SearchContent;
                                                if (SearchContent == "" || SearchContent == null) {
                                                    table.reload('character', {
                                                        data: characterList,
                                                        page: {
                                                            curr: 1,
                                                        }
                                                    }, true);
                                                    form.val("characterSearch", characterSearch);
                                                    return;
                                                }
                                                let searchResult = [];
                                                for (let i = 0; i < characterList.length; i++) {
                                                    if ( new RegExp( SearchContent ).test( characterList[i][SearchFeild] ) ) {
                                                        searchResult.push(characterList[i]);
                                                    }
                                                }
                                                table.reload('character', {
                                                    data: searchResult,
                                                    page: {
                                                        curr: 1,
                                                    }
                                                }, true);
                                                form.val("characterSearch", characterSearch);
                                                break;
                                        }
                                    });
                                },
                                error: function (res) {
                                    console.log("AJAX ERROR!")
                                }
                            });

                            for (let i = 0; i < faultList.length; i++) {
                                faultList[i].RuleName = faultList[i].RuleID == null ? "" : faultList[i].RuleID.split(',').map( x => ruleDict[parseInt(x)]).join("；");
                            }
                            table.render({
                                elem: '#fault'
                                , data: faultList
                                , limit: 30
                                , page: {
                                    groups: 10,
                                    prev: '<em><<</em>',
                                    next: '<em>>></em>',
                                    layout : ['count','prev', 'page', 'next','skip']
                                }
                                , toolbar: `
                                            <div>
                                                <form class="layui-form" lay-filter="faultSearch" onsubmit="return false">
                                                    <div class="layui-form-item" style="margin-bottom: 0px">
                                                        <div class="layui-inline" style="margin-bottom: 0px">
                                                            <label class="layui-form-label">搜索字段</label>
                                                            <div class="layui-input-inline">
                                                                <select name="SearchFeild">
                                                                    <option value="FaultName" selected>故障名称</option>
                                                                    <option value="FaultID">序号</option>
                                                                    <option value="Detail">故障描述</option>
                                                                    <option value="FaultType">故障类型</option>
                                                                    <option value="FaultReason">故障原因</option>
                                                                    <option value="RuleName">相关规则</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="layui-inline" style="margin-bottom: 0px">
                                                            <label class="layui-form-label" style="width: auto;">搜索内容</label>
                                                            <div class="layui-input-inline">
                                                                <input type="text" name="SearchContent" autocomplete="off" class="layui-input">
                                                            </div>
                                                        </div>
                                                        <div class="layui-inline" style="margin-bottom: 0px">
                                                            <div class="layui-input-inline">
                                                                <button class="layui-btn layui-btn-sm" lay-event="search">搜索</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            `
                                , even: true
                                , cols: [[ //表头
                                    { field: 'FaultID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                                    , { field: 'FaultName', title: '故障名称', width: '15%', align: 'center'}
                                    , { field: 'Detail', title: '故障描述', width: '15%', align: 'center'}
                                    , { field: 'FaultType', title: '故障类型', width: '15%', align: 'center'}
                                    , { field: 'FaultReason', title: '故障原因', width: '20%', align: 'center'}
                                    , { field: 'RuleName', title: '相关规则', width: '25%', align: 'center'}
                                ]]
                            });

                            table.on('toolbar(fault)', function (obj) {
                                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                                    case 'search':
                                        let faultSearch = form.val("faultSearch");
                                        let SearchFeild = faultSearch.SearchFeild;
                                        let SearchContent = faultSearch.SearchContent;
                                        if (SearchContent == "" || SearchContent == null) {
                                            table.reload('fault', {
                                                data: faultList,
                                                page: {
                                                    curr: 1,
                                                }
                                            }, true);
                                            form.val("faultSearch", faultSearch);
                                            return;
                                        }
                                        let searchResult = [];
                                        for (let i = 0; i < faultList.length; i++) {
                                            if ( new RegExp( SearchContent ).test( faultList[i][SearchFeild] ) ) {
                                                searchResult.push(faultList[i]);
                                            }
                                        }
                                        table.reload('fault', {
                                            data: searchResult,
                                            page: {
                                                curr: 1,
                                            }
                                        }, true);
                                        form.val("faultSearch", faultSearch);
                                        break;
                                }
                            });

                            for (let i = 0; i < ruleList.length; i++) {
                                ruleList[i].IFName = ruleList[i].IF == null ? "" : ruleList[i].IF.split(';').map( x => characterDict[parseInt(x.split(',')[0])]).join("；");
                                ruleList[i].ThenName = ruleList[i].Then == null ? "" : ruleList[i].Then.split(',').map( x => faultDict[parseInt(x)]).join("；");
                            }
                            table.render({
                                elem: '#rule'
                                , data: ruleList
                                , limit: 30
                                , page: {
                                    groups: 10,
                                    prev: '<em><<</em>',
                                    next: '<em>>></em>',
                                    layout : ['count','prev', 'page', 'next','skip']
                                }
                                , toolbar: `
                                            <div>
                                                <form class="layui-form" lay-filter="ruleSearch" onsubmit="return false">
                                                    <div class="layui-form-item" style="margin-bottom: 0px">
                                                        <div class="layui-inline" style="margin-bottom: 0px">
                                                            <label class="layui-form-label">搜索字段</label>
                                                            <div class="layui-input-inline">
                                                                <select name="SearchFeild">
                                                                    <option value="RuleName" selected>规则名称</option>
                                                                    <option value="RuleID">序号</option>
                                                                    <option value="IFName">规则前提</option>
                                                                    <option value="ThenName">规则结论</option>
                                                                    <option value="Priority">优先级</option>
                                                                    <option value="Explain">规则解释</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="layui-inline" style="margin-bottom: 0px">
                                                            <label class="layui-form-label" style="width: auto;">搜索内容</label>
                                                            <div class="layui-input-inline">
                                                                <input type="text" name="SearchContent" autocomplete="off" class="layui-input">
                                                            </div>
                                                        </div>
                                                        <div class="layui-inline" style="margin-bottom: 0px">
                                                            <div class="layui-input-inline">
                                                                <button class="layui-btn layui-btn-sm" lay-event="search">搜索</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            `
                                , even: true
                                , cols: [[ //表头
                                    { field: 'RuleID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                                    , { field: 'RuleName', title: '规则名称', width: '10%', align: 'center'}
                                    , { field: 'IFName', title: '规则前提', width: '30%', align: 'center'}
                                    , { field: 'ThenName', title: '规则结论', width: '10%', align: 'center'}
                                    , { field: 'Reliability', title: '可信度', width: '8%', align: 'center'}
                                    , { field: 'Priority', title: '优先级', width: '8%', align: 'center'}
                                    , { field: 'ActiveThre', title: '激活阈值', width: '9%', align: 'center'}
                                    , { field: 'Explain', title: '规则解释', width: '15%', align: 'center'}
                                ]]
                            });
                            table.on('toolbar(rule)', function (obj) {
                                switch(obj.event){ // 对应模板元素中的 lay-event 属性值
                                    case 'search':
                                        let ruleSearch = form.val("ruleSearch");
                                        let SearchFeild = ruleSearch.SearchFeild;
                                        let SearchContent = ruleSearch.SearchContent;
                                        if (SearchContent == "" || SearchContent == null) {
                                            table.reload('rule', {
                                                data: ruleList,
                                                page: {
                                                    curr: 1,
                                                }
                                            }, true);
                                            form.val("ruleSearch", ruleSearch);
                                            return;
                                        }
                                        let searchResult = [];
                                        for (let i = 0; i < ruleList.length; i++) {
                                            if ( new RegExp( SearchContent ).test( ruleList[i][SearchFeild] ) ) {
                                                searchResult.push(ruleList[i]);
                                            }
                                        }
                                        table.reload('rule', {
                                            data: searchResult,
                                            page: {
                                                curr: 1,
                                            }
                                        }, true);
                                        form.val("ruleSearch", ruleSearch);
                                        break;
                                }
                            });
                        },
                        error: function () {
                            console.log("AJAX ERROR!")
                        }
                    })
                },
                error: function () {
                    console.log("AJAX ERROR!")
                }
            })
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
});