initName();
var RelationCharts = {};
var RelationLastTime = {};
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
        RelationCharts = {};
        for (var i = 1; i <= 3; i++) {
            RelationCharts[i] = echarts.init(document.getElementById("Relation" + i));
            RelationLastTime[i] = 0;
        }
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawRelationTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawRelationRealTime);
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
                    drawRelation();
                }
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeRelation)', function (data) {
        for (let i = 1; i <= 3; i++) {
            RelationLastTime[i] = 0;
        }
        drawRelation();
    });
    form.on('radio(RType)', function (data) {
        for (let i = 1; i <= 3; i++) {
            RelationLastTime[i] = 0;
        }
        drawRelation();
    });

    function drawRelationRealTime(){
        drawRelation();
    }

    form.on('radio(drawRelationType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawRelationRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function drawRelation() {
    let MPX = parseInt(layui.form.val("RelationSelect").sss);
    let MPY = parseInt(layui.form.val("RelationSelect2").sss);
    let urlRealTime = intervalId == 0?"":"_RealTime";
    let RelationType = layui.form.val("RelationType").rType;
    let endTime = parseInt(new Date().getTime()/1000);
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getRelation" + urlRealTime,
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
            LastTime: RelationLastTime[1],
            TrajectoryType: RelationType,
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum <= RelationLastTime[1]){
                console.log(RelationLastTime[1]);
                return;
            }
            console.log(data.indexNum)
            document.getElementById('Time').innerHTML = new Date(data.indexNum * 1000).toLocaleString('chinese',{hour12: false}).split('/').join('-');
            RelationLastTime[1] = data.indexNum;
            // 指定图表的配置项和数据
            
            var option1 = {
                title: {
                    text: '原始波形'
                },
                textStyle: {
                    fontSize: 15
                },
                legend: {
                    show : true,
                    type: 'scroll',
                    orient: 'horizontal',
                    top: 10,
                    left: 'center',
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
                            name: new Date().toLocaleString('chinese',{hour12: false}).split('/').join('-'),
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
                dataset: {
                    source: data.wave_show_new,
                },
                xAxis: {
                    type: 'value',
                    name: "时间/s",
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: 'dataMax',
                    axisLabel: {
                        showMaxLabel: false,
                    }
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/" + data.RangeUnit,
                    nameLocation: 'middle',
                    nameGap: 30,
                },
                series: [{
                    type: 'line',
                    name: '信号源1',
                    lineStyle: {
                        color: 'blue'
                    },
                    showSymbol: false,
                    encode: {
                        x : 1,
                        y : 0
                    },
                    seriesLayoutBy: 'row'
                }]
            };
            var option2 = {
                title: {
                    text: '相关分析'
                },
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
                            name: new Date().toLocaleString('chinese',{hour12: false}).split('/').join('-'),
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
                dataset: {
                    source: data.cor,
                },
                xAxis: {
                    type: 'value',
                    name: "延时/s",
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: 'dataMax',
                    min: 'dataMin',
                    axisLabel: {
                        showMaxLabel: false,
                    }
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: data.RangeUnit + "^2",
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: RelationType == '1'? 1: null,
                    min: RelationType == '1'? -1: null,
                },
                series: [{
                    type: 'line',
                    name: '相关分析',
                    lineStyle: {
                        color: 'blue'
                    },
                    showSymbol: false,
                    encode: {
                        x : 0,
                        y : 1
                    },
                    seriesLayoutBy: 'row'
                }]
            };
            var option3 = {
                title: {
                    text: '功率谱'
                },
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
                            name: new Date().toLocaleString('chinese',{hour12: false}).split('/').join('-'),
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
                dataset: {
                    source: data.power_spectrum,
                },
                xAxis: {
                    type: 'value',
                    name: "频率/Hz",
                    nameLocation: 'middle',
                    nameGap: 30,
                    max: 'dataMax',
                    axisLabel: {
                        showMaxLabel: false,
                    }
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "功率谱/dB",
                    nameLocation: 'middle',
                    nameGap: 30,
                },
                series: [{
                    type: 'line',
                    name: '信号源1',
                    lineStyle: {
                        color: 'blue'
                    },
                    showSymbol: false,
                    encode: {
                        x : 0,
                        y : 1
                    },
                    seriesLayoutBy: 'row'
                }]
            };
            if (MPX != MPY){
                option1.series.push({
                    type: 'line',
                    name: '信号源2',
                    lineStyle: {
                        color: 'green'
                    },
                    showSymbol: false,
                    encode: {
                        x : 1,
                        y : 2
                    },
                    seriesLayoutBy: 'row'
                })
            }
            RelationCharts[1].setOption(option1, true);
            RelationCharts[2].setOption(option2, true);
            RelationCharts[3].setOption(option3, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
};