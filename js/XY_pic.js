initName("sssX");
initName("sssY");
var XYpicCharts = null;
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
        XYpicCharts = null;
        XYpicCharts = echarts.init(document.getElementById("XYpic"));
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawXYpicTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawXYpicRealTime);
            }
            else{
                drawXYpic();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(XY)', function (data) {
        drawXYpic();
    });

    form.on('radio(XY)', function (data) {
        drawXYpic();
    });

    function drawXYpicRealTime() {
        drawXYpic();
    }

    form.on('radio(drawXYpicType)', function (data) {
        drawType = data.value;
        if (data.value == "0") {
            startTimer(drawXYpicRealTime);
        }
        else {
            clearTimer();
        }
    });
});

function drawXYpic() {
    let searchTime = layui.form.val("getSearchTime");
    let XYAxis = layui.form.val("XYAxis");
    let MPX = parseInt(XYAxis.sssX);
    let MPY = parseInt(XYAxis.sssY);
    let endTime = intervalId == 0 ? (new Date(searchTime.endTime.split('-').join('/')).getTime()) / 1000 : parseInt(new Date().getTime() / 1000);
    let startTime = intervalId == 0 ? (new Date(searchTime.startTime.split('-').join('/')).getTime()) / 1000 : endTime - 3600;
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rVibData/getXYpic",
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPX: MPX,
            MPY: MPY,
            xAxis: XYAxis.xAxis == "LDZB"? "RMS": XYAxis.xAxis,
            yAxis: XYAxis.yAxis == "LDZB"? "RMS": XYAxis.yAxis,
            startTime: startTime,
            endTime: endTime,
        },
        success: function (res) {
            let data = res.data;
            console.log(data.data.length)
            // 指定图表的配置项和数据
            document.getElementById('XYsTime').innerHTML = new Date(startTime * 1000).toLocaleString().split('/').join('-');
            document.getElementById('XYeTime').innerHTML = new Date(endTime * 1000).toLocaleString().split('/').join('-');
            var option1 = {
                textStyle: {
                    fontSize: 15
                },
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
                    name: rvibdataTable[XYAxis.xAxis],
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: 'dataMax',
                    min: 'dataMin',
                    axisLabel: {
                        showMaxLabel: false,
                        showMinLabel: false,
                    }
                },
                yAxis: {
                    type: 'value',
                    name: rvibdataTable[XYAxis.yAxis],
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: function (value) {
                        return Math.ceil(value.max * 10) / 10;
                    },
                    min: function (value) {
                        return Math.floor(value.min * 10) / 10;
                    }
                },
                series: [
                    {
                        data: data.data,
                        type: 'line',
                        name: rvibdataTable[XYAxis.yAxis],
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                    }
                ]
            };
            XYpicCharts.setOption(option1, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
};