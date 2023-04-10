initName();
// echarts
var _table1 = echarts.init(document.getElementById('table1'));

var data0 = [];
for (let i = 0; i < 50; i++) {
  // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];  
  alpha=1
  if (i==0){
    alpha=0.1*(8+Math.random())
  }else{
    alpha=1/i
  }
  data0[i*8+0] = [(i*4+0)*25, 0.01*alpha];    
  data0[i*8+1] = [(i*4+0)*25, 0.0004*alpha];
  data0[i*8+2] = [(i*4+1)*25, 0.0002*alpha];
  data0[i*8+3] = [(i*4+2)*25, 0.0004*alpha];
  data0[i*8+4] = [(i*4+2)*25, 0.005*alpha];
  data0[i*8+5] = [(i*4+2)*25, 0.0004*alpha];
  data0[i*8+6] = [(i*4+3)*25, 0.0002*alpha];
  data0[i*8+7] = [(i*4+4)*25, 0.0004*alpha];
}
var data1 = [];
for (let i = 0; i < 50; i++) {
  // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];  
  alpha=1
  if (i==0){
    alpha=0.8
  }else{
    alpha=1/i
  }
  data1[i*8+0] = [(i*4+0)*25, 0.01*alpha];    
  data1[i*8+1] = [(i*4+0)*25, 0.0004*alpha];
  data1[i*8+2] = [(i*4+1)*25, 0.0002*alpha];
  data1[i*8+3] = [(i*4+2)*25, 0.0004*alpha];
  data1[i*8+4] = [(i*4+2)*25, 0.005*alpha];
  data1[i*8+5] = [(i*4+2)*25, 0.0004*alpha];
  data1[i*8+6] = [(i*4+3)*25, 0.0002*alpha];
  data1[i*8+7] = [(i*4+4)*25, 0.0004*alpha];
}
    
// var max = Math.max.apply(Math,data1);
var data2 = [];
for (let i = 0; i < 400; i++) {
  // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];    
  data2[i] = [i*12.5, Math.ceil(Math.random() * 300) - 150];
}
var data3 = [];
for (let i = 0; i < 400; i++) {
  // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];    
  data3[i] = [i*12.5, Math.ceil(Math.random() * 300) - 150];
}
// 指定图表的配置项和数据
var option0 = {
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
                padding: [0, 0,30, 0]    // 四个数字分别为上右下左与原位置距离
            },
    max: 0.012
  },
  series: [
    {
      data: data0,
      type: 'line',
      lineStyle: {
        color: 'blue',
        width:1.2
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
var option1 = {
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
    max: 0.012,
    nameTextStyle: {
                padding: [0, 0, 30, 0]    // 四个数字分别为上右下左与原位置距离
            },
  },
  series: [
    {
      data: data1,
      type: 'line',
      lineStyle: {
        color: 'blue',
        width:1.2
      },
      showSymbol: false,
      markPoint: {
        data: [
          {
            x: '90%',
            y: '10%',
            value: "x=2494.881Hz\ny=0.004g",
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
        width:1.5
      },
      showSymbol: false,
    }
  ]
};
var option3 = {
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
      data: data3,
      type: 'line',
      lineStyle: {
        color: 'blue',
        width:1.5
      },
      showSymbol: false,
    }
  ]
};
// 使用刚指定的配置项和数据显示图表。
_table1.setOption(option0);
var _table1_ = echarts.init(document.getElementById('table1_')).setOption(option2);
var _table2 = echarts.init(document.getElementById('table2')).setOption(option1);
var _table2_ = echarts.init(document.getElementById('table2_')).setOption(option3);

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