// initName();
var AxisTrajectoryCharts = {};
var TrajectoryType = 0;
var direction = -1;
var AxisTrajectoryLastTime = {};
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
        AxisTrajectoryCharts = {};
        for (var i = 1; i <= 3; i++) {
            AxisTrajectoryCharts[i] = echarts.init(document.getElementById("AxisTrajectory" + i));
            AxisTrajectoryLastTime[i] = 0;
        }
        layui.use(['form'], function () {
            layui.form.render('select')
            layui.form.render('checkbox')
            layui.form.render('radio')
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawAxisTrajectoryTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawAxisTrajectoryRealTime);
            }
            else{
                drawAxisTrajectory();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeAxisTrajectory)', function (data) {
        for (var i = 1; i <= 3; i++) {
            AxisTrajectoryLastTime[i] = 0;
        }
        drawAxisTrajectory();
    });

    function drawAxisTrajectoryRealTime(){
        drawAxisTrajectory();
    }

    form.on('radio(drawAxisTrajectoryType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawAxisTrajectoryRealTime);
        }
        else{
            clearTimer();
        }
    });

    form.on('radio(TrajectoryType)', function (data) {
        AxisTrajectoryLastTime[3] = 0;
        let AxisTrajectoryParameter = layui.form.val("AxisTrajectoryParameter");
        TrajectoryType = parseInt(AxisTrajectoryParameter.status);
        drawAxisTrajectory();
    });
});

function drawAxisTrajectory() {
    let MPX = checkedGroup[layui.form.val("AxisTrajectorySelect").sss].MPX;
    let MPY = checkedGroup[layui.form.val("AxisTrajectorySelect").sss].MPY;
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let endTime = parseInt(new Date().getTime()/1000);
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getRWaveData" + urlRealTime,
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
            LastTime: AxisTrajectoryLastTime[1],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == AxisTrajectoryLastTime[1]) {
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            AxisTrajectoryLastTime[1] = data.indexNum;
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
            AxisTrajectoryCharts[1].setOption(option1, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getRWaveData" + urlRealTime,
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
            LastTime: AxisTrajectoryLastTime[2],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == AxisTrajectoryLastTime[2]) {
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            AxisTrajectoryLastTime[2] = data.indexNum;
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
                        data: data1,
                        type: 'line',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                    }
                ]
            };
            AxisTrajectoryCharts[2].setOption(option2, true);
            document.getElementById('Time').innerHTML = new Date(data.indexNum * 1000).toLocaleString().split('/').join('-');
            document.getElementById('rotSpeed').innerHTML = data.rotSpeed;
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getob" + urlRealTime,
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPX: MPX,
            MPY: MPY,
            TrajectoryType : TrajectoryType,
            IndexNum: checkedTime,
            startTime : 1576753367,
            endTime: endTime,
            pageNum: 1,
            pageSize: 1,
            LastTime: AxisTrajectoryLastTime[3],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == AxisTrajectoryLastTime[3]) {
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            AxisTrajectoryLastTime[3] = data.indexNum;
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
                // dataZoom: [
                //     {
                //         id: 'dataZoomX',
                //         type: 'inside',
                //         xAxisIndex: [0],
                //         filterMode: 'filter'
                //     },
                // ],
                xAxis: {
                    type: 'value',
                    name: "幅值/" + data.RangeUnit,
                    nameLocation: 'middle',
                    nameGap: 30,
                    // max: 'dataMax',
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
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 15,
                            itemStyle: {
                                color: 'red',
                            },
                            data: [{
                                coord: data1[0],
                                // itemStyle: {
                                //     color: 'red',
                                //     borderWidth: 10,
                                // }
                            }]
                        }                
                    }
                ]
            };
            AxisTrajectoryCharts[3].setOption(option3, true);
            if (direction != data.direction) {
                direction = data.direction;
                let img = document.getElementsByName("AxisTrajectoryDirection");
                for (let i = 0; i < img.length; i++) {
                    img[i].src = "../img/direction" + direction + ".png";
                }
            }
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};