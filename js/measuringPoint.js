var UserData = [
    { 'id': 1, 'name': '振动测点'},
    { 'id': 2, 'name': '振动测点'},
    { 'id': 3, 'name': '振动测点'},
]
//initUserData()
var _operator
function getOperator() {
    return _operator
}
drawTable()
function drawTable() {
    layui.use('table', function () {
        var table = layui.table;
        //第一个实例
        table.render({
            elem: '#table1'
            , height: 200
            /*
            , data: [
                {'id':1,'userId':'chen','userName':'陈杰','userZw':'分析员','rightId':'超级管理员'},
                {'id':2,'userId':'张三','userName':'张三','userZw':'采购员','rightId':'一般管理员'},
                {'id':1,'userId':'李四','userName':'李四','userZw':'销售员','rightId':'浏览人员'},
        ]
        */
            , data: UserData
            , cols: [[ //表头
                { type: 'numbers', field: 'id', title: '序号', width: 60, fixed: 'left' }
                , { field: 'name', title: '类别', width: 120 }
                , { fixed: 'right', width: 200, align: 'center', toolbar: '#barDemo' }
            ]]
        });
    });
}

function alarmLayer() { //报警参数弹窗页面
    layer.open({
        type: 2,
        closeBtn: 1,
        area: ['1000px', '700px'],
        content: '../page/alarmParams.html' 
    });
}