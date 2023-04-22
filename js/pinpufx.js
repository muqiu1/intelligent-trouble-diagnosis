initName()
var myCharts = {};
layui.use(['laytpl', 'form', 'layer'], function () {
  var laytpl = layui.laytpl
    , $ = layui.$
    , form = layui.form
    , layer = layui.layer;
  var loadingLayer;
  new Promise(function (resolve, reject) {
    loadingLayer = layer.load(2, {
      shade: [0.5, '#fff'],
      time: 5 * 1000
    });
    var getTpl = demo.innerHTML
    var view = document.getElementById('view');
    var tableData = {
      'list': checkedList
    }
    laytpl(getTpl).render(tableData, function (html) {
      view.innerHTML = html;
    });
    resolve();
  }).then(function () {
    form.render('select')
    myCharts = {};
    for (var i = 0; i < checkedList.length; i++) {
      myCharts[checkedList[i].id + "_table1"] = echarts.init(document.getElementById(checkedList[i].id + "_table1"));
      myCharts[checkedList[i].id + "_table2"] = echarts.init(document.getElementById(checkedList[i].id + "_table2"));
    }
  }).then(function () {
    $(document).ready(function () {
      for (var i = 0; i < checkedList.length; i++) {
        draw(checkedList[i].id, checkedList[i].id);
      }
    })
  }).then(function () {
    layer.close(loadingLayer)
  });
})

layui.use('form', function () {
  var form = layui.form;
  //监听提交
  form.on('select()', function (data) {
    var x = data.value.indexOf('_')
    var id1 = data.value.substr(0, x)
    var id2 = data.value.substr(x + 1)
    draw(parseInt(id1), parseInt(id2))
  });
});

function draw(id, MPID) {
  var data0 = [];
  for (let i = 0; i < 50; i++) {
    // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];  
    alpha = 1
    if (i == 0) {
      alpha = 0.1 * (8 + Math.random())
    } else {
      alpha = 1 / i
    }
    data0[i * 8 + 0] = [(i * 4 + 0) * 25, 0.01 * alpha];
    data0[i * 8 + 1] = [(i * 4 + 0) * 25, 0.0004 * alpha];
    data0[i * 8 + 2] = [(i * 4 + 1) * 25, 0.0002 * alpha];
    data0[i * 8 + 3] = [(i * 4 + 2) * 25, 0.0004 * alpha];
    data0[i * 8 + 4] = [(i * 4 + 2) * 25, 0.005 * alpha];
    data0[i * 8 + 5] = [(i * 4 + 2) * 25, 0.0004 * alpha];
    data0[i * 8 + 6] = [(i * 4 + 3) * 25, 0.0002 * alpha];
    data0[i * 8 + 7] = [(i * 4 + 4) * 25, 0.0004 * alpha];
  }

  // var max = Math.max.apply(Math,data1);
  var data2 = [];
  for (let i = 0; i < 400; i++) {
    // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];    
    data2[i] = [i * 12.5, Math.ceil(Math.random() * 300) - 150];
  }
  var option1 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                //   yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {
                name: new Date().toLocaleString().split('/').join('-'),
            }
        }
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter'
        },
    ],
    xAxis: {
      type: 'value',
      name: "频率/Hz",
      nameLocation: 'middle',
      nameTextStyle: {
        padding: [10, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
      },
    },
    yAxis: {
      type: 'value',
      name: "幅值/g",
      nameLocation: 'middle',
      nameTextStyle: {
        padding: [0, 0, 30, 0]    // 四个数字分别为上右下左与原位置距离
      },
      max: 0.012
    },
    series: [
      {
        data: data0,
        type: 'line',
        lineStyle: {
          color: 'blue',
          width: 1.2
        },
        showSymbol: false,
      }
    ]
  };
  var option2 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                //   yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {
                name: new Date().toLocaleString().split('/').join('-'),
            }
        }
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter'
        },
    ],
    xAxis: {
      type: 'value',
      name: "频率/Hz",
      nameLocation: 'middle',
      nameTextStyle: {
        padding: [10, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
      },
    },
    yAxis: {
      type: 'value',
      name: "相位/g",
      nameTextStyle: {
        padding: [0, 0, 10, 0]    // 四个数字分别为上右下左与原位置距离
      },
      nameLocation: 'middle'
    },
    series: [
      {
        data: data2,
        type: 'line',
        lineStyle: {
          color: 'blue',
          width: 1.5
        },
        showSymbol: false,
      }
    ]
  };
  myCharts[id+"_table1"].setOption(option1);
  myCharts[id+"_table2"].setOption(option2);
}

function ppfxchild(id) {
  console.log(parseInt(id.substr(3)))
  layer.open({
    type: 2,
    area: ['1000px', '700px'],
    shadeClose: true,
    content: './page/ppfxchild.html' //这里content是一个普通的String
    //需要传递参数
  });
}