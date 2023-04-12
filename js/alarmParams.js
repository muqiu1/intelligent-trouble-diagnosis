layui.use(['layer'], function() {
  var layer = layui.layer;
  var aInput = document.getElementById('bianhao');
  var bInput = document.getElementById('lingmindu');

  document.getElementById('select-btn').addEventListener('click', function() {
    // 打开一个iframe窗口
    layer.open({
      type: 2,
      title: '数据选择',
      content: 'test.html',
      area: ['800px', '600px'],
      
      success: function (layero, index) {
        // 获取iframe窗口的DOM对象和window对象
        var iframe = layero.find('iframe')[0];
        var iframeWindow = iframe.contentWindow;

        // 监听来自iframe页面的消息
        window.addEventListener('message', function (event) {
          if (event.origin === 'http://127.0.0.1:5501') {
            var data = event.data;
            if (data.selected) {
              aInput.value = data.a;
              bInput.value = data.b;
              // 关闭iframe窗口
              layer.close(index);
            }
          }
        });
        iframeWindow.postMessage('Hello iframe!', 'http://127.0.0.1:5501');
      }
    });
  });
});