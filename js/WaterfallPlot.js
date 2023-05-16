initName();
var WaterfallPlotCharts = {};
var WaterfallPlotNum = 20;
let index = 0;
let rawDate;
let rawIndexNum;
layui.use(['form', 'layer', 'laypage'], function () {
    var $ = layui.$
        , form = layui.form
        , layer = layui.layer
        , laypage = layui.laypage;
    var loadingLayer;
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5, '#fff'],
            time: 5 * 1000
        });
        WaterfallPlotCharts = {};
        for (var i = 1; i <= 2; i++) {
            WaterfallPlotCharts[i] = echarts.init(document.getElementById("WaterfallPlot" + i));
        }
        laypage.render({
            elem: 'laypage-all', // 元素 id
            count: 1, // 数据总数
            limit: 1,
            groups: 1,
            first: false,
            last: false,
            prev: '<em><<</em>',
            next: '<em>>></em>',
            layout: ['prev', 'page', 'next','count'], // 功能布局
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawWaterfallPlotTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawWaterfallPlotRealTime);
            }
            else{
                drawWaterfallPlot();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeWaterfallPlot)', function (data) {
        drawWaterfallPlot();
    });

    function drawWaterfallPlotRealTime() {
        drawWaterfallPlot();
    }

    form.on('radio(drawWaterfallPlotType)', function (data) {
        drawType = data.value;
        if (data.value == "0") {
            startTimer(drawWaterfallPlotRealTime);
        }
        else {
            clearTimer();
        }
    });
});

function updateWaterfallPlotNum(){
    let Parameter = layui.form.val("WaterfallPlotselect");
    if (Parameter.showNum != "") {
        WaterfallPlotNum = parseInt(Parameter.showNum);
        drawWaterfallPlot();
    }
}

function drawWaterfallPlot(){
    layui.use(['form', 'layer', 'laypage'], function () {
        var $ = layui.$
            , form = layui.form
            , layer = layui.layer
            , laypage = layui.laypage;
        let searchTime = form.val("getSearchTime");
        let Parameter = form.val("WaterfallPlotselect");
        let MPID = parseInt(Parameter.sss);
        let urlRealTime = intervalId == 0?"":"_RealTime";
        let endTime = intervalId == 0? (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000 : parseInt(new Date().getTime()/1000) + 28800;
        let startTime = intervalId == 0? (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000 : endTime - 3600;
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/rWaveData/getWaterfallPlot",
            contentType: "application/x-www-form-urlencoded",
            // async: false,
            dataType: "json",
            data: {
                MPID: MPID,
                startTime : startTime,
                endTime: endTime,
                WaterfallPlotNum: WaterfallPlotNum,
            },
            success: function (res) {
                let data = res.data;
                rawDate = data.data;
                if (rawDate.length > 0) {
                    console.log(data.indexNum[0], data.num, data.data[0][0].length);
                }
                else {
                    console.log(0);
                    return;
                }
                
                laypage.render({
                    elem: 'laypage-all', // 元素 id
                    count: data.num, // 数据总数
                    limit: 1,
                    groups: 1,
                    first: false,
                    last: false,
                    prev: '<em><<</em>',
                    next: '<em>>></em>',
                    layout: ['prev', 'page', 'next','count'], // 功能布局
                    curr: index+1,
                    jump: function(obj, first){
                        // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                        // console.log(obj.limit); // 得到每页显示的条数
                        // 首次不执行
                        if(!first){
                            // do something
                            index = obj.curr - 1;
                            document.getElementById('Time').innerHTML = rawIndexNum[index];
                            
                            WaterfallPlotCharts[2].setOption({
                                dataset: {
                                    source: rawDate[index]
                                },
                                series: [
                                    {
                                        type: 'line',
                                        lineStyle: {
                                            color: 'blue'
                                        },
                                        showSymbol: false,
                                        encode: { x: 0, y: 1 },
                                        seriesLayoutBy: 'row'
                                    }
                                ],
                            });
                        }
                    }
                });
                
                let data1 = [];
                for (let i = 0; i < data.num; i++) {
                    data.indexNum[i] = new Date(data.indexNum[i]*1000).toLocaleString();
                    for (let j = 0; j < data.data[i][0].length; j++) {
                        if (data.is_order && data.data[i][0][j] > 20) {
                            break;
                        }
                        data1.push([data.data[i][0][j].toFixed(3), data.indexNum[i], data.data[i][1][j].toFixed(3)]);
                    }
                }
                rawIndexNum = data.indexNum;
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
                        // interval: data.is_order? 1: null,
                        nameLocation: 'middle',
                        max: data.is_order?20:'dataMax',
                    },
                    yAxis3D: {
                        type: 'category',
                        name: "时间/s",
                        nameLocation: 'middle',
                        nameGap: 30,
                        axisLabel: {
                            margin : 10,
                            interval: 0,
                        }
                    },
                    zAxis3D: {
                        type: 'value',
                        name: "幅值/" + data.RangeUnit,
                        nameLocation: 'middle',
                    },
                    grid3D: {
                        viewControl: {
                            projection: 'orthographic',
                            rotateMouseButton: 'left',
                            panMouseButton: 'right',
                            orthographicSize: 130,
                            alpha: 30,
                            beta: 30,
                        },
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
                            data: data1,
                            type: 'line3D',
                            lineStyle: {
                                color: 'blue'
                            },
                            showSymbol: false
                        }
                    ]
                };
                WaterfallPlotCharts[1].setOption(option3d, true);
                
                var option2 = {
                    dataset: {
                        source: index < rawDate.length? rawDate[index] : null,
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
                            type: 'line',
                            lineStyle: {
                                color: 'blue'
                            },
                            showSymbol: false,
                            encode: { x: 0, y: 1 },
                            seriesLayoutBy: 'row'
                        }
                    ]
                };
                WaterfallPlotCharts[2].setOption(option2, true);
                document.getElementById('Time').innerHTML = rawIndexNum[index];
            },
            error: function () {
                console.log("AJAX ERROR!")
            }
        })
    });
}