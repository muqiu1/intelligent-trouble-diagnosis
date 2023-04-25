var checkedList = [];
var checkedMPID = [];
var now;
var _target = 'overview'
var AlarmCenterPara = { "data": "实时数据", "date1": "2022-01-01 00:00:00", "date2": "2022-01-01 00:00:00", "typeOfData1": "on", "typeOfData2": "on", "allData": "on" }
var treeData;
var host = '81.69.242.66:8888'
var checkedTime = 0;
//JS 
function setTime() {
    now = new Date();
    now = now.toLocaleString().split('/').join('-');
    for (var obj of document.getElementsByName("nowTime")) {
        obj.innerHTML = now;
    }
}
layui.use([], function () {
    setTime();
    setInterval(setTime, 1000);
});

function initName() {
    var slct = document.getElementsByName("sss");
    for (var k = 0; k < slct.length; k++) {
        for (var i = 0; i < checkedList.length; i++) {
            var op = document.createElement("option")
            op.setAttribute('value', checkedList[i].id)
            op.innerHTML = checkedList[i].title;
            slct[k].appendChild(op)
        }
    }
    layui.use(['form'], function () {
        layui.form.render('select')
        layui.form.render('checkbox')
        layui.form.render('radio')
    });
}

layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: '#time1'
        , value: '2019-10-10 06:01:00'
        , isInitValue: true
        , type: 'datetime'
    });
    laydate.render({
        elem: '#time2'
        , value: '2020-02-10 14:01:00'
        , isInitValue: true
        , type: 'datetime'
    });
});

function loadPage(target) {
    if (target != '') {
        _target = target;
        layui.use([], function () {
            var $ = layui.$;
            var path = "./page/" + target + ".html";
            $("#page").load(path);
        });
    }
}

function updateAlarmText(id, string) {
    let e = document.getElementById("id");
    if (e) {
        e.innerText = string;
    }
}

function setAlarm() {
    //判断逻辑：TODO
    let alarmNum = 0;
    let timerTest = setInterval(() => alarmNum++, 2000);
    let timerAlarm = setInterval((alarmNum) => updateAlarmText(alarmNumber, `报警中心(${alarmNum})`));

}


layui.use(['element', 'layer', 'util'], function () {
    var element = layui.element
        , layer = layui.layer
        , util = layui.util
        , $ = layui.$;


    //头部事件
    util.event('lay-header-event', {
        //左侧菜单事件
        menuLeft: function (othis) {
            layer.msg('展开左侧菜单的操作', { icon: 0 });
        }
        , menuRight: function () {
            layer.open({
                type: 1
                , content: '<div style="padding: 15px;">处理右侧面板的操作</div>'
                , area: ['260px', '100%']
                , offset: 'rt' //右上角
                , anim: 5
                , shadeClose: true
            });
        }
    });
});
layui.use(['tree', 'form'], function () {
    var tree = layui.tree
        , layer = layui.layer

    var parameter = {}
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/field/list",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        data: parameter,
        success: function (data) {
            treeData = data.data.list
            for (var i = 0; i < treeData.length; i++) {
                treeData[i].title = treeData[i].fieldName
                treeData[i].id = treeData[i].fieldID
                treeData[i].spread = true
                treeData[i].field = "1"
                if (treeData[i].equipparamsList != null) {
                    treeData[i].children = treeData[i].equipparamsList
                    for (var j = 0; j < treeData[i].children.length; j++) {
                        treeData[i].children[j].title = treeData[i].children[j].equipName
                        treeData[i].children[j].id = treeData[i].children[j].fieldID
                        treeData[i].children[j].spread = true
                        treeData[i].children[j].field = "2"
                        if (treeData[i].children[j].mpparamsList != null) {
                            treeData[i].children[j].children = treeData[i].children[j].mpparamsList
                            for (var k = 0; k < treeData[i].children[j].children.length; k++) {
                                treeData[i].children[j].children[k].title = treeData[i].children[j].children[k].mPName
                                treeData[i].children[j].children[k].id = treeData[i].children[j].children[k].mPID
                                treeData[i].children[j].children[k].field = "3"
                            }
                        }
                    }
                }
            }
            console.log(treeData)

            new Promise(function (resolve, reject) {
                tree.render({
                    elem: '#equipTree'
                    , data: treeData
                    , showCheckbox: true  //是否显示复选框
                    , id: 'demoId1'
                    , isJump: false //是否允许点击节点时弹出新窗口跳转
                    , oncheck: function (othis) {
                        var checkedData = tree.getChecked('demoId1'); //获取选中节点的数据
                        function dfs(l, f) {
                            for (var i = 0; i < l.length; i++) {
                                if (l[i].field == "3") {
                                    l[i].title = f + ' ' + l[i].title
                                    checkedMPID.push(l[i].mPID);
                                    checkedList.push(l[i]);
                                }
                                else if (l[i].children != null) {
                                    dfs(l[i].children, l[i].title);
                                }
                            }
                        };
                        checkedMPID = [];
                        checkedList = [];
                        dfs(checkedData, '');
                        loadPage(_target);
                    }
                });
                resolve();
            }).then(function () {
                tree.setChecked('demoId1', [29, 30, 31, 32])
                loadPage(_target);
                getTimeList()
            })
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
});

function getTimeList(){
    layui.use(['table', 'form'], function () {
        var table = layui.table
        , form = layui.form
        
        let searchTime = form.val("getSearchTime");
        
        let parameter = {}
        new Promise(function (resolve, reject) {
            for (let i=0; i<checkedMPID.length; i++){
                parameter[ "MPIDList[" + i + "]" ] = checkedMPID[i];
            }
            parameter[ "startTime" ] = (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000;
            parameter[ "endTime" ] = (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000;
            resolve();
        }).then(function () {
            table.render({
                elem: '#timeTable'
                , url: "http://" + host + "/cms/rWaveData/list"
                , where : parameter
                , method : 'post'
                , contentType: 'application/x-www-form-urlencoded'
                , toolbar: false
                , cols: [[
                    // { type: 'radio' }, 
                    { field: 'time', title: '时间', width: '200px'
                        , templet: '<div><input type="radio" name="Time" value={{d.id}} title="{{d.time}}" lay-filter="time"></div>'
                    }
                ]]
                , request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    , limitName: 'pageSize' //每页数据量的参数名，默认：limit
                }
                , parseData: function(res){
                    console.log(res)
                    let l = res.data.list;
                    let data = [];
                    for (let i=0; i<l.length; i++){
                        data.push({"time": new Date(l[i].indexNum*1000).toLocaleString().split('/').join('-'), "id": l[i].indexNum});
                    }
                    return {
                        "code": 0, //解析接口状态
                        "msg": res.msg, //解析提示文本
                        "count": res.data.total, //解析数据长度
                        "data":data
                    }
                }
                , limit: 15
                , page: {
                    layout : ['prev', 'next', 'page']
                }
                , loading : true
            });
            //监听行单击事件（双击事件为：rowDouble）
            form.on('radio(time)', function(obj){
                checkedTime = obj.value;
                loadPage(_target);
            });
        });
    });
}