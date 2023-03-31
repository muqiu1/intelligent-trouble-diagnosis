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
drawFFT();


initName();

function drawFFT() {
    var data1 = [];
    var data2 = [];
    var data3 = [];
    // Parametric curve
    for (var t = 0; t < 25; t += 0.001) {
        var x = 75 * Math.cos(t);
        var y = t * 100;
        var z = 5 * Math.exp((75 - x) / 20);
        data1.push([y, x]);
        data2.push([x, z]);
        data3.push([x, y, z]);
    }
    var option1 = {
        tooltip: {},
        xAxis: {
            type: 'value',
            name: "时间/s",
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
                            value: "x=0.00s\ny=0.00g",
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
    var _table1 = echarts.init(document.getElementById("FFT1")).setOption(option1);
    var option2 = {
        tooltip: {},
        xAxis: {
            type: 'value',
            name: "频率/s",
            nameLocation: 'middle'
        },
        yAxis: {
            type: 'value',
            name: "幅值/g",
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
                            value: "x=0.00s\ny=0.00g",
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
    var _table2 = echarts.init(document.getElementById("FFT2")).setOption(option2);
    var option3d = {
        tooltip: {},
        xAxis3D: {
            type: 'value',
            name: "频率/s",
            nameLocation: 'middle'
        },
        yAxis3D: {
            type: 'value',
            name: "时间/s",
            nameLocation: 'middle'
        },
        zAxis3D: {
            type: 'value',
            name: "幅值/g",
            nameLocation: 'middle'
        },
        grid3D: {
            viewControl: {
                projection: 'orthographic'
            }
        },
        series: [
            {
                data: data3,
                type: 'line3D',
                lineStyle: {
                    color: 'blue'
                },
                showSymbol: false
            }
        ]
    };
    var _table3 = echarts.init(document.getElementById("FFT3")).setOption(option3d);
}