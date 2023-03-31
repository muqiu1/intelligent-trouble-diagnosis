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
var _table1_ = echarts.init(document.getElementById('table1_'));
var _table2 = echarts.init(document.getElementById('table2'));
var data1 = [];
for (let i = 0; i < 300; i++) {
    // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
    data1[i] = [i, Math.ceil(Math.random() * 15)];
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
        name: "幅值/mm",
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
                        value: "X:6.064\nY:0.3787mm",
                        symbol: 'roundRect',
                        label: {
                            color: '#000'
                        },
                        itemStyle: {
                            color: 'rgba(255,255,255,0)',
                        }
                    },
                    {
                        x: '10%',
                        y: '10%',
                        value: "X向频谱图",
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
        name: "阶次",
        nameTextStyle: {
            padding: [10, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
        },
        nameLocation: 'middle'
    },
    yAxis: {
        type: 'value',
        name: "幅值/mm",
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
                        value: "X:6.064\nY:0.3787mm",
                        symbol: 'roundRect',
                        label: {
                            color: '#000'
                        },
                        itemStyle: {
                            color: 'rgba(255,255,255,0)',
                        }
                    },
                    {
                        x: '10%',
                        y: '10%',
                        value: "Y向频谱图",
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
data = [];
for (let i = 0; i <= 360; i++) {
    //data[i]=[10 * (1 - Math.sin((Math.PI / 180) * i)), i];
    data[i] = [10 * (1), i];
}
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
        name: "幅值/mm",
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
                        y: '5%',
                        value: "X:11.968\nY:0.236mm",
                        symbol: 'roundRect',
                        label: {
                            color: '#000'
                        },
                        itemStyle: {
                            color: 'rgba(255,255,255,0)',
                        }
                    },
                    {
                        x: '10%',
                        y: '5%',
                        value: "进动谱",
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
// 使用刚指定的配置项和数据显示图表。
_table1.setOption(option1);
_table1_.setOption(option2);
_table2.setOption(option3);