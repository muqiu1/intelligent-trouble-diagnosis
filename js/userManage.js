var UserData = []
var rightRule = { 1: "超级管理员", 2: "一般管理员", 3: "浏览人员" }
var _operator
function getOperator() {
    return _operator
}
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
            for (var i = 0; i < Userlist.length; i++) {
                Userlist[i].rightId = rightRule[Userlist[i].rightId]
            }
            UserData = Userlist
        },
        error: function () {
            console.log('error')
        }
    })
    //第一个实例
    table.render({
        elem: '#table1'
        , height: 200
        , data: UserData
        , cols: [[ //表头
            { type: 'numbers', field: 'id', title: '序号', width: 60, fixed: 'left' }
            , { field: 'UserID', title: '账号', width: 120 }
            , { field: 'UserName', title: '姓名', width: 120, }
            , { field: 'UserZW', title: '职务', width: 120 }
            , { field: 'RightID', title: '权限', width: 120 }
            , { field: 'Describe', title: '备注', width: 120, }
            , { fixed: 'right', width: 200, align: 'center', toolbar: '#barDemo' }
        ]]
    });
});

function user(operator, data) {
    _operator = operator
    if (operator == "edit") {
        //var data ='传递数据'
        layer.open({
            type: 2,
            area: ['700px', '500px'],
            shadeClose: true,
            title: '修改用户信息',
            content: './addUser.html',//这里content是一个普通的String
            success: function (layero, index) {
                // 获取子页面的iframe
                console.log(layero[0], index);
                var iframe = window['layui-layer-iframe' + index];
                // var iframeWin = window[layero.find('iframe')[0]['name']];
                // 向子页面的全局函数child传参
                //iframe.child(data);
                iframe.showUser(data)
            }
            //需要传递参数
        });
    } else if (operator == "add") {
        layer.open({
            type: 2,
            area: ['700px', '500px'],
            shadeClose: true,
            title: '添加用户',
            content: './addUser.html',//这里content是一个普通的String
        });
        //提交后需要更新用户显示
    }
}
function updateUserData(data, operator) {
    if (operator == 'add') {
        rightRule = { "超级管理员": 1, "一般管理员": 2, "浏览人员": 3 }
        //console.log(data)
        UserData.push(data)
        //console.log(UserData)
        data.rightId = rightRule[data.rightId]
        console.log(data)
        /*
        layui.$.ajax({
            type: 'POST',
            url: "http://192.168.10.105:8080/cms/user/add",
            contentType: "application/json",
            async: false,
            dataType: "json",
            //data:{},
            data: data,
            success: function (data) {
                console.log("发送数据成功!!!")
            },
            error: function () {
                console.log('error')
            }
        })
        */
        showUserTable()
    } else if (operator == 'edit') {
        for (var i in UserData) {
            if (UserData[i].userId == data.userId) {
                UserData[i] = data
            }
        }
        showUserTable()
    }

}
function deleteUserData(data) {
    for (var i = 0; i < UserData.length; i++) {
        if (UserData[i].userId == data.userId) {
            de_data = UserData.splice(i, 1)
        }
    }
    console.log(UserData)
    showUserTable()
}

layui.use('table', function () {
    var table = layui.table;
    table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data //获得当前行数据
            , layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'pwReset') {
            //layer.msg('密码重置');
            flag = HTMerDel("确定要重置该用户密码吗？重置后的密码将变为888888")
        } else if (layEvent === 'del') {
            flag = HTMerDel("确定要删除该用户吗？")
            if (flag) {
                deleteUserData(data)
            }
        } else if (layEvent === 'edit') {
            user('edit', data)

        }
    });
});
function HTMerDel(msg) {
    if (confirm(msg))
        return true;
    else
        return false;
}