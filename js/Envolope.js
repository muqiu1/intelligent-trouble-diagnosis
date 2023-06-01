initName();
var EnvolopeCharts = {};
var EnvolopeLowFreq = 0, EnvolopeHighFreq = 1000;
var EnvolopeLastTime = {};
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
            EnvolopeLastTime[i] = 0;
        }
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawEnvolopeTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawEnvolopeRealTime);
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
                    drawEnvolopeTF();
                    drawEnvolope();
                }
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeEnvolope)', function (data) {
        for (var i = 1; i <= 4; i++) {
            EnvolopeLastTime[i] = 0;
        }
        drawEnvolopeTF();
        drawEnvolope();
    });

    function drawEnvolopeRealTime(){
        drawEnvolopeTF();
        drawEnvolope();
    }

    form.on('radio(drawEnvolopeType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawEnvolopeRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function updateEnvolope(){
    EnvolopeLastTime[3] = 0;
    EnvolopeLastTime[4] = 0;
    let EnvolopeParameter = layui.form.val("EnvolopeParameter");
    if (EnvolopeParameter.f_low != "" && EnvolopeParameter.f_high != "") {
        EnvolopeLowFreq = parseInt(EnvolopeParameter.f_low);
        EnvolopeHighFreq = parseInt(EnvolopeParameter.f_high);
        drawEnvolope();
    }
}

function drawEnvolopeTF() {
    let MPID = parseInt(layui.form.val("EnvolopeSelect").sss);
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let endTime = parseInt(new Date().getTime()/1000);
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
            LastTime: EnvolopeLastTime[1],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == EnvolopeLastTime[1]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            EnvolopeLastTime[1] = data.indexNum;
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
            LastTime: EnvolopeLastTime[2],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == EnvolopeLastTime[2]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            EnvolopeLastTime[2] = data.indexNum;
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
    let endTime = parseInt(new Date().getTime()/1000);
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/envolope_show_new" + urlRealTime,
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
            lowFreq: EnvolopeLowFreq,
            highFreq: EnvolopeHighFreq,
            LastTime: EnvolopeLastTime[3],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == EnvolopeLastTime[3]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            EnvolopeLastTime[3] = data.indexNum;
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