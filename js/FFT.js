initName();
var FFTCharts = {};
var FFTLastTime = {};
var FFTwindowType = 0, FFTwindowWidth = 512;
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
        FFTCharts = {};
        for (var i = 1; i <= 3; i++) {
            FFTCharts[i] = echarts.init(document.getElementById("FFT" + i));
            FFTLastTime[i] = 0;
        }
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawFFTTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawFFTRealTime);
            }
            else{
                drawFFTTF();
                drawFFT();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeFFT)', function (data) {
        for (let i = 1; i <= 3; i++) {
            FFTLastTime[i] = 0;
        }
        drawFFTTF();
        drawFFT();
    });

    function drawFFTRealTime(){
        drawFFTTF();
        drawFFT();
    }

    form.on('radio(drawFFTType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawFFTRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function updateFFT(){
    FFTLastTime[3] = 0;
    let FFTparameter = layui.form.val("FFTparameter");
    FFTwindowType = parseInt(FFTparameter.windowType);
    FFTwindowWidth = parseInt(FFTparameter.windowWidth);
    drawFFT();
}

function drawFFTTF() {
    let MPID = parseInt(layui.form.val("FFTselect").sss);
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
            LastTime: FFTLastTime[1],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == FFTLastTime[1]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            FFTLastTime[1] = data.indexNum;
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
            FFTCharts[1].setOption(option1, true);
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
            LastTime: FFTLastTime[2],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == FFTLastTime[2]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            FFTLastTime[2] = data.indexNum;
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
            FFTCharts[2].setOption(option2, true);
            document.getElementById('Time').innerHTML = new Date(data.indexNum * 1000).toLocaleString().split('/').join('-');
            document.getElementById('rotSpeed').innerHTML = data.rotSpeed;
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};

function drawFFT() {
    let MPID = parseInt(layui.form.val("FFTselect").sss);
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let endTime = parseInt(new Date().getTime()/1000);
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getStft" + urlRealTime,
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
            windowWidth: FFTwindowWidth,
            windowType: FFTwindowType,
            LastTime: FFTLastTime[3],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == FFTLastTime[3]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length, data.data[0][0].length)
            FFTLastTime[3] = data.indexNum;
            let data3 = [];
            for (let i = 0; i < data.data[0].length; i++) {
                for (let j = 0; j < data.data[0][i].length; j++) {
                    if (data.is_order && data.data[0][i][j] > 20) {
                        break;
                    }
                    data3.push([data.data[0][i][j].toFixed(3), data.data[2][0][i].toFixed(3), data.data[1][i][j].toFixed(3)]);
                }
            }
            var option3d = {
                tooltip: {
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                },
                xAxis3D: {
                    type: 'value',
                    name: data.is_order?"阶次":"频率/Hz",
                    interval: data.is_order? 1: null,
                    nameLocation: 'middle',
                    max: data.is_order?20:'dataMax',
                },
                yAxis3D: {
                    type: 'value',
                    name: "时间/s",
                    nameLocation: 'middle',
                    max: function (value) {
                        return Math.ceil(value.max * 1000)/1000
                    }
                },
                zAxis3D: {
                    type: 'value',
                    name: "幅值/" + data.RangeUnit,
                    nameLocation: 'middle'
                },
                grid3D: {
                    viewControl: {
                        projection: 'orthographic',
                        rotateMouseButton: 'left',
                        panMouseButton: 'right',
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        restore: {},
                        saveAsImage: {
                            name: new Date().toLocaleString().split('/').join('-'),
                        }
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
            FFTCharts[3].setOption(option3d, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
}