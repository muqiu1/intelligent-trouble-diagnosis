initName();
var EnvolopeCharts = {};
var EnvolopeLowFreq = 0, EnvolopeHighFreq = 1000;
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
        $(document).ready(function () {
            drawEnvolopeTF();
            drawEnvolope();
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
})

function updateEnvolope(){
    let EnvolopeParameter = layui.form.val("EnvolopeParameter");
    EnvolopeLowFreq = parseInt(EnvolopeParameter.f_low);
    EnvolopeHighFreq = parseInt(EnvolopeParameter.f_high);
    drawEnvolope();
}

layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('select(changeEnvolope)', function (data) {
        drawEnvolopeTF();
        drawEnvolope();
    });

    function drawEnvolopeRealTime(){
        drawEnvolopeTF();
        drawEnvolope();
    }

    form.on('radio(drawEnvolopeType)', function (data) {
        if (data.value == "0"){
            startTimer(drawEnvolopeRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function drawEnvolopeTF() {
    let MPID = parseInt(layui.form.val("EnvolopeSelect").sss);
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let endTime = parseInt(new Date().getTime()/1000) + 40000;
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getRWaveData" + urlRealTime,
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
        },
        success: function (res) {
            let data = res.data;
            console.log(data.indexNum, data.data[0].length)
            // 指定图表的配置项和数据
            let newData = [];
            for (let i = 0; i < data.data[1].length; i++) {
                newData.push([data.data[1][i], data.data[0][i]]);
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
                    name: "时间/s",
                    nameLocation: 'middle',
                    nameGap: 30,
                    // max: 'dataMax',
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/" + data.RangeUnit,
                    nameLocation: 'middle',
                    nameGap: 30,
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
            EnvolopeCharts[1].setOption(option1, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
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
        },
        success: function (res) {
            let data = res.data;
            console.log(data.indexNum, data.data[0].length)
            // 指定图表的配置项和数据
            let data1 = [];
            for (let i = 0; i < data.data[1].length; i++) {
                data1.push([data.data[1][i], data.data[0][i]]);
            }
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
            EnvolopeCharts[2].setOption(option2, true);
            document.getElementById('Time').innerHTML = new Date(data.indexNum * 1000).toLocaleString().split('/').join('-');
            document.getElementById('rotSpeed').innerHTML = data.rotSpeed;
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};

function drawEnvolope() {
    let MPID = parseInt(layui.form.val("EnvolopeSelect").sss);
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let endTime = parseInt(new Date().getTime()/1000) + 40000;
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/envolope_show_new" + urlRealTime,
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        data: {
            MPID: MPID,
            IndexNum: checkedTime,
            startTime : 1576753367,
            endTime: endTime,
            pageNum: 1,
            pageSize: 1,
            lowFreq: EnvolopeLowFreq,
            highFreq: EnvolopeHighFreq,
        },
        success: function (res) {
            let data = res.data;
            console.log(data.indexNum, data.data[0].length)

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
                    name: "时间/s",
                    nameLocation: 'middle',
                    nameGap: 30,
                    // max: 'dataMax',
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/" + data.RangeUnit,
                    nameLocation: 'middle',
                    nameGap: 30,
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
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/" + data.RangeUnit,
                    nameLocation: 'middle',
                    nameGap: 30,
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