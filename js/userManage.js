var UserData = [
  {'id':1,'userId':'chen','userName':'陈杰','userZw':'分析员','rightId':'超级管理员'},
  {'id':2,'userId':'张三','userName':'张三','userZw':'采购员','rightId':'一般管理员'},
  {'id':1,'userId':'李四','userName':'李四','userZw':'销售员','rightId':'浏览人员'},
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
                  //{ title: '#number', minWidth: 20, title: "序号", align: "center", unresize: true,templet:'#number'}
                  , { field: 'userId', title: '账号', width: 120 }
                  , { field: 'userName', title: '姓名', width: 120, }
                  , { field: 'userZw', title: '职务', width: 120 }
                  , { field: 'rightId', title: '角色', width: 120 }
                  , { field: 'memo', title: '备注', width: 120, }
                  , { fixed: 'right', width: 200, align: 'center', toolbar: '#barDemo' }
              ]]
          });
      });
  }
  function initUserData() {
      layui.$.ajax({
          type: 'POST',
          url: "http://192.168.10.105:8080/cms/user/list",
          contentType: "application/json",
          async: false,
          dataType: "json",
          data: {},
          success: function (data) {
              rightRule = { 1: "超级管理员", 2: "一般管理员", 3: "浏览人员" }
              Userlist = data.data.list
              console.log(Userlist)
              for (var i = 0; i < Userlist.length; i++) {
                  Userlist[i].rightId = rightRule[Userlist[i].rightId]
              }
              UserData = Userlist
          },
          error: function () {
              console.log('error')
          }
      })
  }

  function user(operator, data) {
      _operator = operator
      if (operator == "edit") {
          //var data ='传递数据'
          layer.open({
              type: 2,
              area: ['700px', '500px'],
              shadeClose: true,
              title: '修改用户信息',
              content: './addUser.html',//这里content是一个普通的String
              success: function (layero, index) {
                  // 获取子页面的iframe
                  console.log(layero[0], index);
                  var iframe = window['layui-layer-iframe' + index];
                  // var iframeWin = window[layero.find('iframe')[0]['name']];
                  // 向子页面的全局函数child传参
                  //iframe.child(data);
                  iframe.showUser(data)
              }
              //需要传递参数
          });
      } else if (operator == "add") {
          layer.open({
              type: 2,
              area: ['700px', '500px'],
              shadeClose: true,
              title: '添加用户',
              content: './addUser.html',//这里content是一个普通的String
          });
          //提交后需要更新用户显示
      }
  }
  function updateUserData(data, operator) {
      if (operator == 'add') {
          rightRule = { "超级管理员": 1, "一般管理员": 2, "浏览人员": 3 }
          //console.log(data)
          UserData.push(data)
          //console.log(UserData)
          data.rightId = rightRule[data.rightId]
          console.log(data)
          /*
          layui.$.ajax({
              type: 'POST',
              url: "http://192.168.10.105:8080/cms/user/add",
              contentType: "application/json",
              async: false,
              dataType: "json",
              //data:{},
              data: data,
              success: function (data) {
                  console.log("发送数据成功!!!")
              },
              error: function () {
                  console.log('error')
              }
          })
          */
          drawTable()
      } else if (operator == 'edit') {
          for (var i in UserData) {
              if (UserData[i].userId == data.userId) {
                  UserData[i] = data
              }
          }
          drawTable()
      }

  }
  function deleteUserData(data) {
      for (var i = 0; i < UserData.length; i++) {
          if (UserData[i].userId == data.userId) {
              de_data = UserData.splice(i, 1)
          }
      }
      console.log(UserData)
      drawTable()
  }

  layui.use('table', function () {
      var table = layui.table;
      table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
          var data = obj.data //获得当前行数据
              , layEvent = obj.event; //获得 lay-event 对应的值
          if (layEvent === 'pwReset') {
              //layer.msg('密码重置');
              flag = HTMerDel("确定要重置该用户密码吗？重置后的密码将变为888888")
          } else if (layEvent === 'del') {
              flag = HTMerDel("确定要删除该用户吗？")
              if (flag) {
                  deleteUserData(data)
              }
              //下拉菜单
              // dropdown.render({
              //     elem: this //触发事件的 DOM 对象
              //     ,show: true //外部事件触发即显示
              //     ,data: [{
              //     title: '编辑'
              //     ,id: 'edit'
              //     },{
              //     title: '删除'
              //     ,id: 'del'
              //     }]
              //     ,click: function(menudata){
              //     if(menudata.id === 'del'){
              //         layer.confirm('真的删除行么', function(index){
              //         obj.del(); //删除对应行（tr）的DOM结构
              //         layer.close(index);
              //         //向服务端发送删除指令
              //         });
              //     } else if(menudata.id === 'edit'){
              //         layer.msg('编辑操作，当前行 ID:'+ data.id);
              //     }
              //     }
              //     ,align: 'right' //右对齐弹出（v2.6.8 新增）
              //     ,style: 'box-shadow: 1px 1px 10px rgb(0 0 0 / 12%);' //设置额外样式
              // })
          } else if (layEvent === 'edit') {
              user('edit', data)

          }
      });
  });
  function HTMerDel(msg) {
      if (confirm(msg))
          return true;
      else
          return false;
  }
  var testlist = [1, 2, 3]
  ppp = function (a) {
      testlist.push(4)
  }