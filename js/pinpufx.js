initName()
var FreqCharts = {};
var FreqLastTime = {};
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
    form.render('radio')
    FreqCharts = {};
    for (var i = 0; i < checkedList.length; i++) {
      checkedList[i].drawId = checkedList[i].id;
      FreqCharts[checkedList[i].id + "_table1"] = echarts.init(document.getElementById(checkedList[i].id + "_table1"));
      FreqCharts[checkedList[i].id + "_table2"] = echarts.init(document.getElementById(checkedList[i].id + "_table2"));
      FreqLastTime[checkedList[i].id] = 0;
    }
  }).then(function () {
    $(document).ready(function () {
      form.val("drawFreqTypeForm", { status: drawType});
      if ( drawType == "0"){
        startTimer(drawFreqRealTime);
      }
      else{
        if ( checkedTime == 0 || checkedTime == null ){
          layer.alert('请先在左侧选择查询时间戳', {
              icon: 0,
              shadeClose: true,
              title: "提示",
          })
        }
        else {
          for (var i = 0; i < checkedList.length; i++) {
            drawFreq(checkedList[i].id, checkedList[i].id);
          }
        }
      }
    })
  }).then(function () {
    layer.close(loadingLayer)
  });
  
  //监听提交
  form.on('select(changeFreq)', function (data) {
    var x = data.value.indexOf('_')
    var id1 = parseInt(data.value.substr(0, x))
    var id2 = parseInt(data.value.substr(x + 1))
    FreqLastTime[id1] = 0;
    if (intervalId == 0){
      drawFreq(id1, id2)
    }
    else{
      drawFreq(id1, id2, "_RealTime");
    }
    for (var i = 0; i < checkedList.length; i++) {
      if (checkedList[i].id == id1) {
        checkedList[i].drawId = id2
      }
    }
  });

  function drawFreqRealTime(){
    for (var i = 0; i < checkedList.length; i++) {
      drawFreq(checkedList[i].id, checkedList[i].drawId, "_RealTime");
    }
  }

  form.on('radio(drawFreqType)', function (data) {
    drawType = data.value;
    if (data.value == "0"){
      startTimer(drawFreqRealTime);
    }
    else{
      clearTimer();
    }
  });
});

function drawFreq(id, MPID, urlRealTime='') {
  let endTime = parseInt(new Date().getTime()/1000);
  layui.$.ajax({
    type: 'POST',
    url: "http://" + host + "/cms/rWaveData/fft_show_new" + urlRealTime,
    contentType: "application/x-www-form-urlencoded",
    // async: false,
    dataType: "json",
    data: {
      MPID: MPID,
      IndexNum: checkedTime,
      startTime : 1576753367,
      endTime: endTime,
      pageNum: 1,
      pageSize: 1,
      LastTime: FreqLastTime[id],
    },
    success: function (res) {
      let data = res.data;
      if (data.indexNum == FreqLastTime[id]) {
        console.log(data.indexNum);
        return;
      }
      console.log(data.indexNum, data.data[0].length)
      FreqLastTime[id] = data.indexNum;
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
          },
          valueFormatter: (value) => value.toFixed(3)
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
          name: data.is_order?"阶次":"频率/Hz",
          nameLocation: 'middle',
          nameGap: 30,
          max: data.is_order?20:'dataMax',
        },
        yAxis: {
          type: 'value',
          name: "幅值/" + data.RangeUnit,
          nameLocation: 'middle',
          nameGap: 30,
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
          },
          valueFormatter: (value) => value.toFixed(3)
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
          name: data.is_order?"阶次":"频率/Hz",
          nameLocation: 'middle',
          nameGap: 30,
          max: data.is_order?20:'dataMax',
        },
        yAxis: {
          type: 'value',
          name: "相位/°",
          nameLocation: 'middle',
          nameGap: 30,
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
      FreqCharts[id + "_table1"].setOption(option1, true);
      FreqCharts[id + "_table2"].setOption(option2, true);
      document.getElementById(id + 'Time').innerHTML = new Date(data.indexNum*1000).toLocaleString().split('/').join('-');
      document.getElementById(id+'rotSpeed').innerHTML = data.rotSpeed;
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