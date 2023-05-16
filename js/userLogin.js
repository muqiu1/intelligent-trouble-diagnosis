var host = '81.69.242.66:8080'
layui.use('form', function () {
  var form = layui.form;
  //监听提交
  form.on('submit(formDemo)', function (data) {
    isLogin = judgeLogin(data.field);    //判断账号密码是否正确
    if (isLogin) {
      window.location.href = '../index.html';
      window.event.returnValue = false;    //加上这一行才能跳转
      //window.open('./userManage.html');
    }
    else {
      layer.msg('账号或密码错误');
    }
    stopDefault();
    function stopDefault(e) {
      //阻止默认浏览器动作(W3C)
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {//IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
      }
      return false;
    }
    return false;

  });
});
function judgeLogin(_data) {
  console.log(_data)
  /*判断data和数据库账号密码*/
  flag = false
  layui.$.ajax({
    type: 'POST',
    url: "http://" + host + "/cms/user/list",
    contentType: "application/json",
    async: false,
    dataType: "json",
    data: {},
    success: function (data) {
      Userlist = data.data.list
      for (var i = 0; i < Userlist.length; i++) {
        if ((_data.account == Userlist[i].UserID) && (_data.password == Userlist[i].PWD)) {
          flag = true
          break
        }
      }
    },
    error: function () {
      console.log('error')
    }
  })
  return flag
}
function exit() {
  window.close()
}
