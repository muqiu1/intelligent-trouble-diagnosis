// initName();
var AxisPositionCharts = {};
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
        AxisPositionCharts = {};
        for (var i = 1; i <= 3; i++) {
            AxisPositionCharts[i] = echarts.init(document.getElementById("AxisPosition" + i));
        }
        layui.use(['form'], function () {
            layui.form.render('select')
            layui.form.render('checkbox')
            layui.form.render('radio')
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            drawAxisPosition();
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
})

layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('select(changeAxisPosition)', function (data) {
        drawAxisPosition();
    });

    function drawAxisPositionRealTime(){
        drawAxisPosition();
    }

    form.on('radio(drawAxisPositionType)', function (data) {
        if (data.value == "0"){
            startTimer(drawAxisPositionRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function drawAxisPosition() {
    let searchTime = layui.form.val("getSearchTime");
    let MPX = checkedGroup[layui.form.val("AxisPositionSelect").sss].MPX;
    let MPY = checkedGroup[layui.form.val("AxisPositionSelect").sss].MPY;
    let endTime = intervalId == 0? (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000 : parseInt(new Date().getTime()/1000) + 28800;
    let startTime = intervalId == 0? (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000 : endTime - 3600;
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getShaftLoc",
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPX: MPX,
            MPY: MPY,
            startTime : startTime,
            endTime: endTime,
        },
        success: function (res) {
            let data = res.data;
            console.log(data)
            console.log(data.indexNum, data.data[0].length)
            // 指定图表的配置项和数据
            document.getElementById('sTime').innerHTML = new Date(startTime * 1000).toLocaleString().split('/').join('-');
            document.getElementById('eTime').innerHTML = new Date(endTime * 1000).toLocaleString().split('/').join('-');
            document.getElementById('rotSpeed').innerHTML = data.rotSpeed;
            let data1 = [];
            for (let i = 0; i < data.xTime.length; i++) {
                data1.push([data.xTime[i]*1000, data.gapx[i]]);
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
                    type: 'time',
                    name: "时间",
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: 'dataMax',
                    min: 'dataMin',
                },
                yAxis: {
                    type: 'value',
                    name: "电压/V",
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
            AxisPositionCharts[1].setOption(option1, true);
            let data2 = [];
            for (let i = 0; i < data.xTime.length; i++) {
                data2.push([data.xTime[i]*1000, data.gapy[i]]);
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
                    type: 'time',
                    name: "时间",
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: 'dataMax',
                    min: 'dataMin',
                },
                yAxis: {
                    type: 'value',
                    name: "电压/V",
                    nameLocation: 'middle',
                    nameGap: 30,
                },
                series: [
                    {
                        data: data2,
                        type: 'line',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                    }
                ]
            };
            AxisPositionCharts[2].setOption(option2, true);
            let data3 = [];
            for (let i = 0; i < data.data[0].length; i++) {
                data3.push([data.data[1][i], data.data[0][i]]);
            }
            var option3 = {
                polar: {
                    center: ["50%", "50%"]
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
                        restore: {},
                        saveAsImage: {
                            name: new Date().toLocaleString().split('/').join('-'),
                        }
                    }
                },
                angleAxis: {
                    type: "value",
                    startAngle: 270,
                    // splitNumber: 36,
                    clockwise: false //刻度增长逆时针
                },
                radiusAxis: {
                    min: 0,
                    max: data.ShaftGap,
                },
                series: [
                    {
                        coordinateSystem: "polar",
                        name: "line",
                        type: "line",
                        showSymbol: false,
                        emphasis: {
                            itemStyle :{
                                color: 'red',
                                borderColor: 'red',
                                borderWidth: 8
                            }
                        },
                        data: data3
                    },
                ]
            };
            AxisPositionCharts[3].setOption(option3, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
};