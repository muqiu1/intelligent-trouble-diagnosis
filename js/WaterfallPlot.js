initName();
var WaterfallPlotCharts = {};
var WaterfallPlotNum = 20;
let index = 0;
let rawDate;
let rawIndexNum;
var WaterfallPlotStartTime = [];
var WaterfallPlotLastTime = 0;
layui.use(['form', 'layer', 'laypage'], function () {
    var $ = layui.$
        , form = layui.form
        , layer = layui.layer
        , laypage = layui.laypage
        , laydate = layui.laydate;
    var loadingLayer;
    let searchTime = form.val("getSearchTime");
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5, '#fff'],
            time: 5 * 1000
        });
        WaterfallPlotCharts = {};
        WaterfallPlotLastTime = 0;
        for (var i = 1; i <= 2; i++) {
            WaterfallPlotCharts[i] = echarts.init(document.getElementById("WaterfallPlot" + i));
        }
        laydate.render({
            elem: '#index-range',
            range: ['#StartIndex', '#EndIndex'],
            type: 'datetime',
        });
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

        form.val("getStartSearchTime", {
            startTime : searchTime.startTime,
            endTime : searchTime.endTime
        })
        
        WaterfallPlotStartTime.push({
            startTime: (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000,
            endTime: (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000,
        })

        let slct = document.getElementsByName('start-end');
        for (var k = 0; k < slct.length; k++) {
            var op1 = document.createElement("option");
            op1.setAttribute('value', 0)
            op1.setAttribute('selected', true);
            op1.innerHTML = searchTime.startTime + " ~ " + searchTime.endTime;
            slct[k].appendChild(op1);
        }
        resolve();
    }).then(function () {
        form.render('select');
        $(document).ready(function () {
            form.val("drawWaterfallPlotTypeForm", { status: drawType});
            if ( drawType == "0"){
                switchFormDisabled(true)
                startTimer(drawWaterfallPlotRealTime);
            }
            else{
                switchFormDisabled(false)
                drawWaterfallPlot();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeWaterfallPlot)', function (data) {
        WaterfallPlotLastTime = 0;
        drawWaterfallPlot();
    });
    form.on('select(changeWaterfallPlotStartTime)', function (data) {
        WaterfallPlotLastTime = 0;
        drawWaterfallPlot();
    });

    function drawWaterfallPlotRealTime() {
        drawWaterfallPlot();
    }

    form.on('radio(drawWaterfallPlotType)', function (data) {
        drawType = data.value;
        if (data.value == "0") {
            switchFormDisabled(true)
            startTimer(drawWaterfallPlotRealTime);
        }
        else {
            switchFormDisabled(false)
            clearTimer();
        }
    });

    function switchFormDisabled(flag){
        if (flag){
            $("form[id='getStartSearchTime'] button").addClass("layui-btn-disabled");
        }
        else{
            $("form[id='getStartSearchTime'] button").removeClass("layui-btn-disabled");
        }
        $("form[id='getStartSearchTime'] select").attr("disabled",flag);
        form.render('select');
    }
});

function updateWaterfallPlotNum(){
    WaterfallPlotLastTime = 0;
    let Parameter = layui.form.val("WaterfallPlotselect");
    if (Parameter.showNum != "") {
        WaterfallPlotNum = parseInt(Parameter.showNum);
        drawWaterfallPlot();
    }
    return false;
}

function drawWaterfallPlot(){
    layui.use(['form', 'layer', 'laypage'], function () {
        var $ = layui.$
            , form = layui.form
            , layer = layui.layer
            , laypage = layui.laypage;
            
        let startSearchTime = form.val("getStartSearchTime");
        let MPID = parseInt(form.val("WaterfallPlotselect").sss);
        let endTime = intervalId == 0? WaterfallPlotStartTime[ startSearchTime["start-end"] ].endTime : parseInt(new Date().getTime()/1000) + 28800;
        let startTime = intervalId == 0? WaterfallPlotStartTime[ startSearchTime["start-end"] ].startTime : endTime - 3600;
        let isStartStop = (intervalId != 0 || parseInt(startSearchTime["start-end"]) == 0 )? false: true;
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
                isStartStop: isStartStop,
                LastTime : WaterfallPlotLastTime,
            },
            success: function (res) {
                let data = res.data;
                if (data.num > 0) {
                    console.log(data.indexNum[0], data.num, data.data[0][0].length);
                    WaterfallPlotLastTime = data.indexNum[0];
                }
                else {
                    console.log(0);
                    return;
                }
                rawDate = data.data;
                
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
                
                let seriesList = [];
                for (let i = 0; i < data.num; i++) {
                    let data1 = [];
                    data.indexNum[i] = new Date(data.indexNum[i]*1000).toLocaleString();
                    if (isStartStop) {
                        for (let j = 0; j < data.data[i][0].length; j++) {
                            if (data.is_order && data.data[i][0][j] > 20) {
                                break;
                            }
                            data1.push([data.data[i][0][j].toFixed(3), data.rotSpeed[i], data.data[i][1][j].toFixed(3)]);
                        }
                    }
                    else{
                        for (let j = 0; j < data.data[i][0].length; j++) {
                            if (data.is_order && data.data[i][0][j] > 20) {
                                break;
                            }
                            data1.push([data.data[i][0][j].toFixed(3), data.indexNum[i], data.data[i][1][j].toFixed(3)]);
                        }
                    }
                    seriesList.push(
                        {
                            data: data1,
                            type: 'line3D',
                            lineStyle: {
                                color: 'blue'
                            },
                            showSymbol: false
                        }
                    );
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
                        type: isStartStop ? 'value' :'category',
                        name: isStartStop ? '转速/rpm' : "时间/s",
                        nameLocation: 'middle',
                        max: 'dataMax',
                        min: 'dataMin',
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
                    series: seriesList
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

function getStartTimeList(){
    layui.use('form', function () {
        var form = layui.form
            , $ = layui.$;

        let searchTime = form.val("getSearchTime");
        let startSearchTime = form.val("getStartSearchTime");
        let slct = document.getElementsByName('start-end');
        var op1 = document.createElement("option");
        op1.setAttribute('value', 0)
        op1.setAttribute('selected', true);
        op1.innerHTML = searchTime.startTime + " ~ " + searchTime.endTime;

        WaterfallPlotStartTime = [];
        WaterfallPlotStartTime.push({
            startTime: (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000,
            endTime: (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000,
        })

        for (var k = 0; k < slct.length; k++) {
            slct[k].innerHTML = "";
            slct[k].appendChild(op1);
        }
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/rVibData/getStart",
            contentType: "application/x-www-form-urlencoded",
            async: false,
            dataType: "json",
            data: {
                startTime: (new Date(startSearchTime.startTime.split('-').join('/')).getTime())/1000,
                endTime: (new Date(startSearchTime.endTime.split('-').join('/')).getTime())/1000,
            },
            success: function (res) {
                // console.log(res.data);
                for (var i = 0; i < res.data.length; i++) {
                    WaterfallPlotStartTime.push({
                        startTime: res.data[i].StartIndex,
                        endTime: res.data[i].EndIndex,
                    })
                    for (var k = 0; k < slct.length; k++) {
                        var op = document.createElement("option");
                        op.setAttribute('value', i+1 );
                        op.innerHTML = "启停分析："+ new Date( res.data[i].StartIndex*1000 ).toLocaleString().split('/').join('-') + " ~ " + new Date( res.data[i].EndIndex*1000 ).toLocaleString().split('/').join('-');
                        slct[k].appendChild(op);
                    }
                }
                form.render('select');
            },
            error: function () {
                form.render('select');
                console.log("AJAX ERROR!")
            }
        });
    });
}