var rightRule = { 1: "超级管理员", 2: "一般管理员", 3: "浏览人员" }

layui.use('table', function () {
    var table = layui.table;
    layui.$.ajax({
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
                elem: '#UserInfo'
                , data: Userlist
                , cols: [[ //表头
                    { field: 'UserID', title: '账号', width: '20%' }
                    , { field: 'UserName', title: '姓名', width: '20%' }
                    , { field: 'UserZW', title: '职务', width: '20%' }
                    , { field: 'RightID', title: '权限', width: '20%', templet: function(d){ return '<span>'+rightRule[d.RightID]+'</span>' } }
                    , { field: 'Describe', title: '备注', width: '20%' }
                ]]
            });
        },
        error: function () {
            console.log('error')
        }
    })
});
