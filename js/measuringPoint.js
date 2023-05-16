var pointData = [
    { 'id': 3, 'name': '有功功率', 'type': '工艺测点', 'position': '1', 'from': '其他类型', 'channel': 564, 'isCheck': '是', 'isOK': '是' },
    { 'id': 4, 'name': '电机侧加速度', 'type': '振动测点', 'position': '末端轴承y', 'from': '模拟通道', 'channel': 1, 'isCheck': '是', 'isOK': '是' },
    { 'id': 5, 'name': '中间加速度', 'type': '振动测点', 'position': '末端轴承y', 'from': '模拟通道', 'channel': 2, 'isCheck': '是', 'isOK': '是' },
    { 'id': 6, 'name': '末端侧加速度', 'type': '振动测点', 'position': '末端轴承y', 'from': '模拟通道', 'channel': 3, 'isCheck': '是', 'isOK': '是' },
]
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
            , data: pointData
            , cols: [[ //表头
                { field: 'id', title: '序号', width: 60, fixed: 'left' }
                , { field: 'name', title: '测点名称', width: 120 }
                , { field: 'type', title: '测点类型', width: 120 }
                , { field: 'position', title: '测点位置', width: 120 }
                , { field: 'from', title: '信号来源', width: 120 }
                , { field: 'channel', title: '通道', width: 120 }
                , { field: 'isCheck', title: '是否检测', width: 120 }
                , { field: 'isOK', title: '是否OK', width: 120 }
                , { fixed: 'right', width: 200, align: 'center', toolbar: '#barDemo' }
            ]]
        });
    });
}

function alarmLayer() { //报警参数弹窗页面
    layer.open({
        type: 2,
        closeBtn: 1,
        area: ['1200px', '800px'],
        content: '../page/alarmParams.html' 
    });
}