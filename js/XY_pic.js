initName();
var _table1 = echarts.init(document.getElementById('table1'));

    var data1 = [];
    for (let i = 0; i < 400; i++) {
      // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
      if (i<20){
        data1[i] = [i, Math.random() * 7+1];
      }else{
        data1[i]=[i,(10.6-1)/(400-20)*(i-20)+1];
        delta=0;
        if(Math.random()<0.4){
          if(Math.random()<0.1){
            delta=Math.random()/2+0.5
          }else if(Math.random()<0.9){
            delta=Math.random()/3
          }else{
            delta=-Math.random()/3
          }
        }
        data1[i]=[i,data1[i][1]+delta]
      }
      
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
        //name: "频率/Hz",
        nameLocation: 'middle'
      },
      yAxis: {
        type: 'value',
        //name: "幅值/g",
        nameLocation: 'middle',
        max: 14.5
      },
      series: [
        {
          data: data1,
          type: 'line',
          lineStyle: {
            color: 'blue',
            width: 1.2
          },
          showSymbol: false,
          markPoint: {
            data: [
              {
                x: '90%',
                y: '10%',
                value: "x=2.286\ny=1.1772",
                symbol: 'roundRect',
                label: {
                  color: '#000'
                },
                itemStyle: {
                  color: 'rgba(255,255,255,0)',
                }
              },
            ]
          },
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    _table1.setOption(option1);
    // layui.use(['layer', 'form'], function () {
    //   var form = layui.form;
    //   //此处即为 radio 的监听事件
    //   form.on('radio(*)', function (obj) {
    //     //layer.msg('触发了事件3');
    //     var $ = layui.$
    //     var data = $(obj.elem);
    //     var axis_name = data[0].title
    //     var axis = data[0].name
    //     var data = option1.series[0].data     //注意此处要加上[0]
    //     var data_rest = [];
    //     //生成随机数组    
    //     for (let i = 0; i < 300; i++) {
    //       data_rest[i] = Math.ceil(Math.random() * 15);
    //     }
    //     for (let i = 0; i < 300; i++) {
    //       // if (axis =='X'){
    //       //   data[i]=[data_rest[i],data[i][1]]   //更换X轴数据
    //       // }
    //       // else if (axis =='Y'){
    //       //   data[i]=[data[i][0],data_rest[i]]   //更换Y轴数据
    //       // }
    //       // else{
    //       //   console.log('条件语句error!')
    //       // }
    //       data[i] = [data[i][0], data_rest[i]]   //更换Y轴数据
    //       // option1.series.data = data  
    //       // _table1.setOption(option1);
    //     }
    //     option1.series[0].data = data
    //     _table1.setOption(option1);
    //   });
    // });