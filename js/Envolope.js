initName();
var EnvolopeCharts = {};
layui.use(['form', 'layer'], function () {
    var $ = layui.$
        , form = layui.form
        , layer = layui.layer;
    var loadingLayer;
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5, '#fff'],
            time: 5 * 1000
        });
        EnvolopeCharts = {};
        for (var i = 1; i <= 4; i++) {
            EnvolopeCharts[i] = echarts.init(document.getElementById("Envolope" + i));
        }
        resolve();
    }).then(function () {
        drawTF(checkedList[0].id);
    }).then(function () {
        layer.close(loadingLayer)
    });
})

layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('select(changeEnvolope)', function (data) {
        var id1 = data.value
        drawTF(parseInt(id1))
    });
});

function drawTF(MPID) {
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getRWaveData",
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPID: MPID,
            IndexNum: checkedTime
        },
        success: function (data) {
            console.log(data.data)
            // 指定图表的配置项和数据
            let newData = [];
            for (let i = 0; i < data.data[1].length; i++) {
                newData.push([data.data[1][i], data.data[0][i]]);
            }
            var option = {
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
                    name: "时间/s",
                    nameLocation: 'middle',
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/g",
                    nameLocation: 'middle',
                    nameGap: 40
                },
                series: [
                    {
                        data: newData,
                        type: 'line',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                    }
                ]
            };
            EnvolopeCharts[1].setOption(option, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/fft_show_new",
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPID: MPID,
            IndexNum: checkedTime
        },
        success: function (data) {
            console.log(data.data)
            // 指定图表的配置项和数据
            let data1 = [];
            for (let i = 0; i < data.data[1].length; i++) {
                data1.push([data.data[1][i], data.data[0][i]]);
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
            EnvolopeCharts[2].setOption(option1, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })

    document.getElementById('Time').innerHTML = new Date(checkedTime * 1000).toLocaleString().split('/').join('-');
};

function drawEnvolope() {
    let EnvolopeParameter = layui.form.val("EnvolopeParameter");
    let EnvolopeSelect = layui.form.val("EnvolopeSelect");
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/envolope_show_new",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        data: {
            MPID: parseInt(EnvolopeSelect.sss),
            IndexNum: checkedTime,
            lowFreq: parseFloat(EnvolopeParameter.f_low),
            highFreq: parseFloat(EnvolopeParameter.f_high),
        },
        success: function (data) {
            console.log(data.data)

            let data3 = [];
            let data4 = [];
            for (let i = 0; i < data.data[0].length; i++) {
                data3.push([data.data[0][i], data.data[1][i]]);
            }
            for (let i = 0; i < data.data[2].length; i++) {
                data4.push([data.data[2][i], data.data[3][i]]);
            }
            var option3 = {
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
                    name: "时间/s",
                    nameLocation: 'middle',
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/g",
                    nameLocation: 'middle',
                    nameGap: 40
                },
                series: [
                    {
                        data: data3,
                        type: 'line',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                    }
                ]
            };
            var option4 = {
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
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/g",
                    nameLocation: 'middle',
                    nameGap: 40
                },
                series: [
                    {
                        data: data4,
                        type: 'line',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                    }
                ]
            };
            EnvolopeCharts[3].setOption(option3, true);
            EnvolopeCharts[4].setOption(option4, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
}