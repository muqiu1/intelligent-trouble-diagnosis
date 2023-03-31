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
initName();

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
        name: "阶次",
        nameTextStyle: {
            padding: [10, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
        },
        nameLocation: 'middle'
    },
    yAxis: {
        type: 'value',
        name: "主振矢幅值mm",
        nameTextStyle: {
            padding: [0, 0, 10, 0]    // 四个数字分别为上右下左与原位置距离
        },
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
                        value: "X=11.3288\nY=0.3773mm",
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

var option2 = {
    xAxis: {
        type: 'value',
        name: "阶次",
        nameTextStyle: {
            padding: [10, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
        },
        nameLocation: 'middle'
    },
    yAxis: {
        type: 'value',
        name: "振矢角",
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
            markPoint: {
                data: [
                    {
                        x: '90%',
                        y: '10%',
                        value: "X=12.378\nY=21.5256",
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
var option3 = {
    xAxis: {
        type: 'value',
        name: "阶次",
        nameTextStyle: {
            padding: [10, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
        },
        nameLocation: 'middle'
    },
    yAxis: {
        type: 'value',
        name: "副振矢幅值mm",
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
            markPoint: {
                data: [
                    {
                        x: '90%',
                        y: '10%',
                        value: "X:12.378\nY:0.1533",
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
var option4 = {
    xAxis: {
        type: 'value',
        name: "阶次",
        nameTextStyle: {
            padding: [10, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
        },
        nameLocation: 'middle'
    },
    yAxis: {
        type: 'value',
        name: "矢功率谱/dB",
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
            markPoint: {
                data: [
                    {
                        x: '90%',
                        y: '10%',
                        value: "X:0\nY:0dB",
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

var _table1_ = echarts.init(document.getElementById('table1_')).setOption(option2);
var _table2 = echarts.init(document.getElementById('table2')).setOption(option3);
var _table2_ = echarts.init(document.getElementById('table2_')).setOption(option4);