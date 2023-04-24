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
        drawFreq(checkedList[i].id, checkedList[i].id);
      }
    })
  }).then(function () {
    layer.close(loadingLayer)
  });
})

layui.use('form', function () {
  var form = layui.form;
  //监听提交
  form.on('select(changeFreq)', function (data) {
    var x = data.value.indexOf('_')
    var id1 = data.value.substr(0, x)
    var id2 = data.value.substr(x + 1)
    drawFreq(parseInt(id1), parseInt(id2))
  });
});

function drawFreq(id, MPID) {
  layui.$.ajax({
    type: 'POST',
    url: "http://" + host + "/cms/rWaveData/fft_show_new",
    contentType: "application/x-www-form-urlencoded",
    async: false,
    dataType: "json",
    data: {
      MPID: MPID,
      IndexNum: checkedTime
    },
    success: function (data) {
      console.log(data.data)
      // 指定图表的配置项和数据
      let data1 = [];
      let data2 = [];
      for (let i = 0; i < data.data[1].length; i++) {
        data1.push([data.data[1][i], data.data[0][i]]);
        data2.push([data.data[1][i], data.data[2][i]]);
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
        },
        series: [
          {
            data: data1,
            type: 'line',
            lineStyle: {
              color: 'blue'
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
          name: "相位/°",
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
              color: 'blue'
            },
            showSymbol: false,
          }
        ]
      };
      myCharts[id + "_table1"].setOption(option1, true);
      myCharts[id + "_table2"].setOption(option2, true);
      document.getElementById(id + 'Time').innerHTML = new Date(checkedTime * 1000).toLocaleString().split('/').join('-');
    },
    error: function () {
      console.log("AJAX ERROR!")
    }
  })
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