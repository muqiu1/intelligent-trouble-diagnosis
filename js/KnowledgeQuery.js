layui.use(['table', 'laypage', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$
    
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
            table.render({
                elem: '#character'
                , data: data.data
                , limit: data.data.length
                , cols: [[ //表头
                    { field: 'CharacterID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                    , { field: 'CharacterName', title: '征兆名称', width: '25%', align: 'center'}
                    , { field: 'Detail', title: '征兆描述', width: '65%', align: 'center'}
                ]]
            });
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
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
            table.render({
                elem: '#fault'
                , data: data.data
                , limit: data.data.length
                , cols: [[ //表头
                    { field: 'FaultID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                    , { field: 'FaultName', title: '故障名称', width: '15%', align: 'center'}
                    , { field: 'Detail', title: '故障描述', width: '15%', align: 'center'}
                    , { field: 'FaultType', title: '故障类型', width: '10%', align: 'center'}
                    , { field: 'FaultLoc', title: '故障位置', width: '10%', align: 'center'}
                    , { field: 'FaultReason', title: '故障原因', width: '15%', align: 'center'}
                    , { field: 'Measures', title: '解决方案', width: '15%', align: 'center'}
                    , { field: 'RuleID', title: '相关规则', width: '10%', align: 'center'}
                ]]
            });
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
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
                elem: '#rule'
                , data: data.data
                , limit: data.data.length
                , cols: [[ //表头
                    { field: 'RuleID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                    , { field: 'RuleName', title: '规则名称', width: '15%', align: 'center'}
                    , { field: 'IF', title: '规则前提', width: '20%', align: 'center'}
                    , { field: 'Then', title: '规则结论', width: '10%', align: 'center'}
                    , { field: 'Reliability', title: '可信度', width: '5%', align: 'center'}
                    , { field: 'Priority', title: '优先级', width: '5%', align: 'center'}
                    , { field: 'ActiveThre', title: '激活阈值', width: '10%', align: 'center'}
                    , { field: 'Explain', title: '规则解释', width: '15%', align: 'center'}
                    , { field: 'ActiveTimes', title: 'ActiveTimes', width: '10%', align: 'center'}
                ]]
            });
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
});