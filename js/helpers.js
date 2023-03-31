//函数复用
function setTime() {
  now = new Date();
  now = now.toLocaleString().split('/').join('-');
  for (var obj of document.getElementsByName("nowTime")) {
      obj.innerHTML = now;
  }
}

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

export {setTime, initName, loadPage};