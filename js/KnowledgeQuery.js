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
                            table.render({
                                elem: '#character'
                                , data: characterList
                                , limit: characterList.length
                                , cols: [[ //表头
                                    { field: 'CharacterID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                                    , { field: 'CharacterName', title: '征兆名称', width: '25%', align: 'center'}
                                    , { field: 'Detail', title: '征兆描述', width: '50%', align: 'center'}
                                    , { field: 'RuleName', title: '相关规则', width: '15%', align: 'center', templet: function(d){
                                        if (d.RuleID == null) {
                                            return '<span></span>';
                                        }
                                        let ruleIDList = d.RuleID.split(',');
                                        let ruleNameList = ruleIDList.map( x => ruleDict[parseInt(x)]);
                                        return '<span>' + ruleNameList.join(";") + '</span>';
                                    }}
                                ]]
                            });
                            table.render({
                                elem: '#fault'
                                , data: faultList
                                , limit: faultList.length
                                , cols: [[ //表头
                                    { field: 'FaultID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                                    , { field: 'FaultName', title: '故障名称', width: '15%', align: 'center'}
                                    , { field: 'Detail', title: '故障描述', width: '10%', align: 'center'}
                                    , { field: 'FaultType', title: '故障类型', width: '10%', align: 'center'}
                                    , { field: 'FaultLoc', title: '故障位置', width: '10%', align: 'center'}
                                    , { field: 'FaultReason', title: '故障原因', width: '15%', align: 'center'}
                                    , { field: 'Measures', title: '解决方案', width: '15%', align: 'center'}
                                    , { field: 'RuleName', title: '相关规则', width: '15%', align: 'center', templet: function(d){
                                        if (d.RuleID == null) {
                                            return '<span></span>';
                                        }
                                        let ruleIDList = d.RuleID.split(',');
                                        let ruleNameList = ruleIDList.map( x => ruleDict[parseInt(x)]);
                                        return '<span>' + ruleNameList.join(";") + '</span>';
                                    }}
                                ]]
                            });
                            table.render({
                                elem: '#rule'
                                , data: ruleList
                                , limit: ruleList.length
                                , cols: [[ //表头
                                    { field: 'RuleID', title: '序号', width: '10%', fixed: 'left', align: 'center'}
                                    , { field: 'RuleName', title: '规则名称', width: '15%', align: 'center'}
                                    , { field: 'IFName', title: '规则前提', width: '30%', align: 'center', templet: function(d){
                                        if (d.Then == null) {
                                            return '<span></span>';
                                        }
                                        let characterIDList = d.IF.split(';');
                                        let characterNameList = characterIDList.map( x => characterDict[parseInt(x.split(',')[0])]);
                                        return '<span>' + characterNameList.join("；") + '</span>';
                                    }}
                                    , { field: 'ThenName', title: '规则结论', width: '10%', align: 'center', templet: function(d){
                                        if (d.Then == null) {
                                            return '<span></span>';
                                        }
                                        let faultIDList = d.Then.split(',');
                                        let faultNameList = faultIDList.map( x => faultDict[parseInt(x)]);
                                        return '<span>' + faultNameList.join(";") + '</span>';
                                    }}
                                    , { field: 'Reliability', title: '可信度', width: '5%', align: 'center'}
                                    , { field: 'Priority', title: '优先级', width: '5%', align: 'center'}
                                    , { field: 'ActiveThre', title: '激活阈值', width: '10%', align: 'center'}
                                    , { field: 'Explain', title: '规则解释', width: '15%', align: 'center'}
                                ]]
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