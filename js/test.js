layui.use(['table'], function() {
  var table = layui.table;

  // 渲染数据表格
  table.render({
    elem: '#data-table',
    url: 'testdata.json',
    dataType: 'json',
    cols: [[
      {type: 'radio'},
      {field: 'a', title: 'a'},
      {field: 'b', title: 'b'}
    ]],
    page: true
  });

  // 监听表格勾选事件
  table.on('radio(data-table)', function(obj) { //data-table是table标签对应的lay-filter属性
    // 向父页面发送数据
    if (obj.checked) {
      var data = obj.data;
      console.log(data);
      var message = {
        selected: true
      };
        message.a = data.a;
        message.b = data.b;
        window.parent.postMessage(message, 'http://127.0.0.1:5501');
      }
    });
  });