//JS 
var _target = 'userManage'
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


function loadPage(target) {
    if (target != '') {
        _target = target;
        layui.use([], function () {
            var $ = layui.$;
            var path = "./" + target + ".html";
            $("#page").load(path);
        });
    }
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

loadPage(_target)