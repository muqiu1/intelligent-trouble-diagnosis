// initName();
var PrecessionCharts = {};
var PrecessionLastTime = {};
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
        var slct = document.getElementsByName("sss");
        for (var k = 0; k < slct.length; k++) {
            for (var key in checkedGroup) {
                var op = document.createElement("option")
                op.setAttribute('value', key)
                op.innerHTML = key;
                slct[k].appendChild(op)
            }
        }
        PrecessionCharts = {};
        for (var i = 1; i <= 3; i++) {
            PrecessionCharts[i] = echarts.init(document.getElementById("Precession" + i));
            PrecessionLastTime[i] = 0;
        }
        layui.use(['form'], function () {
            layui.form.render('select')
            layui.form.render('checkbox')
            layui.form.render('radio')
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawPrecessionTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawPrecessionRealTime);
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
                    drawPrecession();
                }
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changePrecession)', function (data) {
        for (var i = 1; i <= 3; i++) {
            PrecessionLastTime[i] = 0;
        }
        drawPrecession();
    });

    function drawPrecessionRealTime(){
        drawPrecession();
    }

    form.on('radio(drawPrecessionType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawPrecessionRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function drawPrecession() {
    let MPX = checkedGroup[layui.form.val("PrecessionSelect").sss].MPX;
    let MPY = checkedGroup[layui.form.val("PrecessionSelect").sss].MPY;
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let endTime = parseInt(new Date().getTime()/1000);
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/fft_show_new" + urlRealTime,
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPID: MPX,
            IndexNum: checkedTime,
            startTime : 1576753367,
            endTime: endTime,
            pageNum: 1,
            pageSize: 1,
            LastTime: PrecessionLastTime[1],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == PrecessionLastTime[1]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            PrecessionLastTime[1] = data.indexNum;
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
                        data: newData,
                        type: 'line',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                    }
                ]
            };
            PrecessionCharts[1].setOption(option1, true);
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
            MPID: MPY,
            IndexNum: checkedTime,
            startTime : 1576753367,
            endTime: endTime,
            pageNum: 1,
            pageSize: 1,
            LastTime: PrecessionLastTime[2],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == PrecessionLastTime[2]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            PrecessionLastTime[2] = data.indexNum;
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
            PrecessionCharts[2].setOption(option2, true);
            document.getElementById('Time').innerHTML = new Date(data.indexNum * 1000).toLocaleString().split('/').join('-');
            document.getElementById('rotSpeed').innerHTML = data.rotSpeed;
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getWholeSpectrum" + urlRealTime,
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPX: MPX,
            MPY: MPY,
            IndexNum: checkedTime,
            startTime : 1576753367,
            endTime: endTime,
            pageNum: 1,
            pageSize: 1,
            LastTime: PrecessionLastTime[3],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == PrecessionLastTime[3]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            PrecessionLastTime[3] = data.indexNum;
            // 指定图表的配置项和数据
            let data1 = [];
            for (let i = 0; i < data.data[1].length; i++) {
                data1.push([data.data[0][i], data.data[1][i]]);
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
                    name: data.is_order?"阶次":"频率/Hz",
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: data.is_order?  20:'dataMax',
                    min: data.is_order? -20:'dataMin',
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
            PrecessionCharts[3].setOption(option3, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};