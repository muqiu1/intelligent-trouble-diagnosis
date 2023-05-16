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
        url: "http://" + host + "/cms/faultdiagnosis/characterList",
        data: {},
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        success: function (res) {
            let data = res.data;
            console.log(data.data.length, data.data[0]);
            table.render({
                elem: '#fault'
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
});