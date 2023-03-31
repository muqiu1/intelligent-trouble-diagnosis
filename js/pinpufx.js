initName();

layui.use('laydate', function () {
  var laydate = layui.laydate;
  laydate.render({
    elem: '#time1'
    , value: '2022-11-22 17:03:22'
    , isInitValue: true
    , type: 'datetime'
  });
  laydate.render({
    elem: '#time2'
    , value: '2022-11-22 17:03:22'
    , isInitValue: true
    , type: 'datetime'
  });
});

// echarts
var _table1 = echarts.init(document.getElementById('table1'));

var data1 = [];
for (let i = 0; i < 300; i++) {
  // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
  data1[i] = [i, Math.ceil(Math.random() * 10000)];
}
// var max = Math.max.apply(Math,data1);
var data2 = [];
for (let i = 0; i < 300; i++) {
  // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
  data2[i] = [i, Math.ceil(Math.random() * 300) - 150];
}
// 指定图表的配置项和数据
var option1 = {
  xAxis: {
    type: 'value',
    name: "频率/Hz",
    nameLocation: 'middle'
  },
  yAxis: {
    type: 'value',
    name: "幅值/g",
    nameLocation: 'middle'
  },
  series: [
    {
      data: data1,
      type: 'line',
      lineStyle: {
        color: 'blue'
      },
      showSymbol: false,
      markPoint: {
        data: [
          {
            x: '90%',
            y: '10%',
            value: "x=2498.881Hz\ny=0.00g",
            symbol: 'roundRect',
            label: {
              color: '#000'
            },
            itemStyle: {
              color: 'rgba(255,255,255,0)',
            }
          },
          {
            x: '15%',
            y: '10%',
            value: "峰值频率：149.54Hz ",
            symbol: 'roundRect',
            label: {
              color: '#000'
            },
            itemStyle: {
              color: 'rgba(255,255,255,0)',
            }
          }
        ]
      },
    }
  ]
};

var option2 = {
  xAxis: {
    type: 'value',
    name: "频率/Hz",
    nameLocation: 'middle'
  },
  yAxis: {
    type: 'value',
    name: "相位/g",
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
// 使用刚指定的配置项和数据显示图表。
_table1.setOption(option1);
var _table1_ = echarts.init(document.getElementById('table1_')).setOption(option2);
var _table2 = echarts.init(document.getElementById('table2')).setOption(option1);
var _table2_ = echarts.init(document.getElementById('table2_')).setOption(option2);

function btn1() {
  layer.open({
    type: 2,
    area: ['1000px', '700px'],
    shadeClose: true,
    content: './page/ppfxchild.html' //这里content是一个普通的String
    //需要传递参数
  });
}
function btn2() {
  layer.open({
    type: 2,
    area: ['1000px', '700px'],
    shadeClose: true,
    content: './page/ppfxchild.html' //这里content是一个普通的String
  });
}