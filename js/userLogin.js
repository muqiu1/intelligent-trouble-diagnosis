var host = '81.69.242.66:8888'
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
  /*判断data和数据库账号密码*/
  flag = false
  layui.$.ajax({
    type: 'POST',
    url: "http://" + host + "/cms/user/login",
    contentType: "application/x-www-form-urlencoded",
    async: false,
    dataType: "json",
    data: _data,
    success: function (res) {
      if (res.code == 200){
        window.sessionStorage.setItem('UserID', res.data.UserID);
        window.sessionStorage.setItem('UserName', res.data.UserName);
        window.sessionStorage.setItem('RightID', res.data.RightID);
        flag = true
      }
    },
    error: function () {
      console.log('error')
    }
  })
  return flag
}