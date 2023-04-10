var checkedList = [];
var now;
var _target = 'overview'
var AlarmCenterPara = { "data": "实时数据", "date1": "2022-01-01 00:00:00", "date2": "2022-01-01 00:00:00", "typeOfData1": "on", "typeOfData2": "on", "allData": "on" }
var treeData;
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

function alarmLayer() { //报警参数弹窗页面
    layer.open({
        type: 2,
        closeBtn: 1,
        area: ['1000px', '700px'],
        content: '../page/alarmParams.html' 
    });
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
layui.use(['tree'], function () {
    var tree = layui.tree
        , layer = layui.layer

    var parameter = {}
    // layui.$.ajax({
    //     type: 'POST',
    //     url: "http://192.168.10.105:8080/cms/field/list",
    //     contentType: "application/json",
    //     async: false,
    //     dataType: "json",
    //     data: parameter,
    //     success: function (data) {
    //         treeData = data.data.list
    //         for (var i=0; i<treeData.length; i++){
    //             treeData[i].title = treeData[i].fieldName
    //             treeData[i].id = treeData[i].fieldID
    //             treeData[i].spread = true
    //             treeData[i].field = "1"
    //             if (treeData[i].equipparamsList != null){
    //                 treeData[i].children = treeData[i].equipparamsList
    //                 for (var j=0; j<treeData[i].children.length; j++){
    //                     treeData[i].children[j].title = treeData[i].children[j].equipName
    //                     treeData[i].children[j].id = treeData[i].children[j].fieldID
    //                     treeData[i].children[j].spread = true
    //                     treeData[i].children[j].field = "2"
    //                     if (treeData[i].children[j].mpparamsList != null){
    //                         treeData[i].children[j].children = treeData[i].children[j].mpparamsList
    //                         for (var k=0; k<treeData[i].children[j].children.length; k++){
    //                             treeData[i].children[j].children[k].title = treeData[i].children[j].children[k].mPName
    //                             treeData[i].children[j].children[k].id = treeData[i].children[j].children[k].mPID
    //                             treeData[i].children[j].children[k].field = "3"
    //                         }
    //                     }
    //                 }
    //             }
    //         }
        //模拟数据
        treeData = [{
          title: '二期风电场'
          , id: 3
          , field: '1'
          // , checked: true
          , spread: true
          , children: [{
            title: '1#风机'
            , id: 31
            , field: '2'
          }]
        },{
          title: '试验台'
          , id: 1
          , field: '1'
          // , checked: true
          , spread: true
          , children: [{
            title: '浆液循环泵'
            , id: 21
            , field: '2'
          },{
            title: '转子试验台'
            , id: 11
            , field: 'name11'
            , spread: true
            , children: [{
              title: '电机侧位移x'
              , id: 111
              , field: '3'
              // , checked: true
            }, {
              title: '电机侧位移y'
              , id: 112
              , field: '3'
            }, {
              title: '端侧位移x'
              , id: 113
              , field: '3'
            }, {
              title: '端侧位移y'
              , id: 114
              , field: '3'
            }]
          }]
        }]
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
                                    checkedList.push(l[i]);
                                }
                                else if ( l[i].children != null ) {
                                    dfs(l[i].children, l[i].title);
                                }
                            }
                        };
                        checkedList = [];
                        dfs(checkedData, '');
                        loadPage(_target);
                    }
                });
                resolve();
            }).then(function () {
                tree.setChecked('demoId1', [111, 112, 113, 114])
                loadPage(_target);
            })
    //     },
    //     error: function () {
    //         console.log(2)
    //     }
    // })


});

layui.use('table', function(){
    var table = layui.table;
    
    table.render({
      elem: '#timeTable'
    //   ,url: ''
      ,toolbar: false
      ,data: [
        {'time':'2019-12-19 15:05:44'},
        {'time':'2019-12-19 15:06:44'},
        {'time':'2019-12-19 15:07:44'},
        {'time':'2019-12-19 15:08:44'},
        {'time':'2019-12-19 15:09:44'},
        {'time':'2019-12-19 15:10:44'},
        {'time':'2019-12-19 15:11:44'},
        {'time':'2019-12-19 15:12:44'},
        {'time':'2019-12-19 15:13:44'},
        {'time':'2019-12-19 15:14:44'},
        {'time':'2019-12-19 15:15:44'},
        {'time':'2019-12-19 15:16:44'},
        {'time':'2019-12-19 15:17:44'},
        {'time':'2019-12-19 15:18:44'},
        {'time':'2019-12-19 15:19:44'},
      ]
      ,cols: [[
        {type:'radio'}
        ,{field:'time', title: '时间', sort: true}
      ]]
      ,limit : 30
      ,page: true
    });
    
    //头工具栏事件
    table.on('toolbar(test)', function(obj){
      var checkStatus = table.checkStatus(obj.config.id); //获取选中行状态
      switch(obj.event){
        case 'getCheckData':
          var data = checkStatus.data;  //获取选中行数据
          layer.alert(JSON.stringify(data));
        break;
      };
    });
  });