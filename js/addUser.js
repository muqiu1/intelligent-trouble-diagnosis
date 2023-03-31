//Demo
layui.use('form', function(){
  var form = layui.form;       
  //监听提交
  form.on('submit(formDemo)', function(data){
    //layer.msg(JSON.stringify(data.field));        //数据
      //console.log(data.field)
      layer.msg('提交成功')
      //parent.ppp('父页面获取子页面值')
      console.log(parent._operator)           //直接使用父窗口中定义的变量
      parent.updateUserData(data.field,parent._operator)
      //return false;
      var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
      parent.layer.close(index); //再执行关闭
  });
});
//assignValue()
function showUser(data){
  var form = layui.form;
  form.val('example', {                     //表单赋值
  "userId": data.userId 
  ,"userName": data.userName
  ,"userZw": data.userZw
  ,"rightId": data.rightId      //复选框选中状态
  ,"memo": data.memo      //开关状态
  });     
}
function child(dataFromFather) {
  console.log(dataFromFather)
}
//parent.ppp('父页面获取子页面值')