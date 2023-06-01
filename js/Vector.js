var VectorCharts = {};
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
        VectorCharts = {};
        for (var i = 1; i <= 4; i++) {
            VectorCharts[i] = echarts.init(document.getElementById("Vector" + i));
        }
        layui.use(['form'], function () {
            layui.form.render('select')
            layui.form.render('checkbox')
            layui.form.render('radio')
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawVectorTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawVectorRealTime);
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
                    drawVector();
                }
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeVector)', function (data) {
        drawVector();
    });

    function drawVectorRealTime(){
        drawVector();
    }

    form.on('radio(drawVectorType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawVectorRealTime);
        }
        else{
            clearTimer();
        }
    });
});
function drawVector() {
    let MPX = checkedGroup[layui.form.val("VectorSelect").sss].MPX;
    let MPY = checkedGroup[layui.form.val("VectorSelect").sss].MPY;
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let endTime = parseInt(new Date().getTime()/1000);
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getVectorspectrum" + urlRealTime,
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
        },
        success: function (res) {
            let data = res.data;
            console.log(data.indexNum, data.data[0].length)
            // 指定图表的配置项和数据
            document.getElementById('Time').innerHTML = new Date(data.indexNum * 1000).toLocaleString().split('/').join('-');
            document.getElementById('rotSpeed').innerHTML = data.rotSpeed;
            let data1 = [];
            let data2 = [];
            let data3 = [];
            let data4 = [];
            for (let i = 0; i < data.data[0].length; i++) {
                data1.push([data.data[0][i], data.data[1][i]]);
                data2.push([data.data[0][i], data.data[2][i]]);
                data3.push([data.data[0][i], data.data[3][i]]);
                data4.push([data.data[0][i], data.data[4][i]]);
            }
            let xAxisName = data.is_order?"阶次":"频率/Hz";
            let max = data.is_order? 20: "dataMax";
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
                    name: xAxisName,
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: max,
                },
                yAxis: {
                    type: 'value',
                    name: "主振矢幅值/" + data.RangeUnit,
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
                    name: xAxisName,
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: max,
                },
                yAxis: {
                    type: 'value',
                    name: "副振矢幅值/" + data.RangeUnit,
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
                    name: xAxisName,
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: max,
                },
                yAxis: {
                    type: 'value',
                    name: "振矢角/°",
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
                    name: xAxisName,
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: max,
                },
                yAxis: {
                    type: 'value',
                    name: "矢功率谱/dB",
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
            VectorCharts[1].setOption(option1, true);
            VectorCharts[2].setOption(option2, true);
            VectorCharts[3].setOption(option3, true);
            VectorCharts[4].setOption(option4, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
};