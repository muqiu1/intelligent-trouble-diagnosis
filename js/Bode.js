initName();
var BodeCharts = {};
var BodeStartTime = [];
layui.use(['form', 'layer', 'laydate'], function () {
    var $ = layui.$
        , form = layui.form
        , layer = layui.layer
        , laydate = layui.laydate;
    var loadingLayer;
    let searchTime = form.val("getSearchTime");
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5, '#fff'],
            time: 5 * 1000
        });
        BodeCharts = {};
        for (var i = 1; i <= 3; i++) {
            BodeCharts[i] = echarts.init(document.getElementById("Bode" + i));
        }
        laydate.render({
            elem: '#index-range',
            range: ['#StartIndex', '#EndIndex'],
            type: 'datetime',
        });

        form.val("getStartSearchTime", {
            startTime : searchTime.startTime,
            endTime : searchTime.endTime
        })

        BodeStartTime.push({
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
            form.val("drawBodeTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawBodeRealTime);
            }
            else{
                drawBode();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeBode)', function (data) {
        drawBode();
    });
    form.on('select(changeBodeStartTime)', function (data) {
        drawBode();
    });

    function drawBodeRealTime(){
        drawBode();
    }

    form.on('radio(drawBodeType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawBodeRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function drawBode() {
    let startSearchTime = layui.form.val("getStartSearchTime");
    let MPID = parseInt(layui.form.val("BodeSelect").sss);
    let endTime = intervalId == 0? BodeStartTime[ startSearchTime["start-end"] ].endTime : parseInt(new Date().getTime()/1000) + 28800;
    let startTime = intervalId == 0? BodeStartTime[ startSearchTime["start-end"] ].startTime : endTime - 3600;
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rVibData/getBode",
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPID: MPID,
            startTime : startTime,
            endTime: endTime,
        },
        success: function (res) {
            let data = res.data;
            // console.log(data)
            console.log(data.data.length)
            // 指定图表的配置项和数据
            document.getElementById('sTime').innerHTML = new Date(startTime * 1000).toLocaleString().split('/').join('-');
            document.getElementById('eTime').innerHTML = new Date(endTime * 1000).toLocaleString().split('/').join('-');
            var option1 = {
                dataset: {
                    source: data.data,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    formatter: function (params) {
                        params = params[0];
                        return params.value[params.dimensionNames[params.encode.y[0]]].toFixed(3)
                    },
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
                    name: "转速/rpm",
                    nameLocation: 'middle',
                    nameGap: 30,
                    // max: 'dataMax',
                    min: 'dataMin',
                },
                yAxis: {
                    type: 'value',
                    name: "相位/°",
                    nameLocation: 'middle',
                    nameGap: 30,
                },
                series: [
                    {
                        type: 'line',
                        name: '相位',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                        encode: {
                            x : "RotSpeed",
                            y : "X1P"
                        }
                    }
                ]
            };
            BodeCharts[1].setOption(option1, true);
            var option2 = {
                dataset: {
                    source: data.data,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    formatter: function (params) {
                        params = params[0];
                        return params.value[params.dimensionNames[params.encode.y[0]]].toFixed(3)
                    },
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
                    name: "转速/rpm",
                    nameLocation: 'middle',
                    nameGap: 30,
                    // max: 'dataMax',
                    min: 'dataMin',
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/"+ data.RangeUnit,
                    nameLocation: 'middle',
                    nameGap: 30,
                },
                series: [
                    {
                        type: 'line',
                        name: '幅值',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                        encode: {
                            x : "RotSpeed",
                            y : "X1Mag"
                        }
                    }
                ]
            };
            BodeCharts[2].setOption(option2, true);
            echarts.connect([BodeCharts[1], BodeCharts[2]]);
            var option3 = {
                polar: {
                    center: ["50%", "50%"]
                },
                dataset: {
                    source: data.data,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            precision : 3,
                            backgroundColor: '#6a7985'
                        }
                    },
                    formatter: function (params) {
                        params = params[0];
                        return (
                            '转速：' + params.value['RotSpeed'].toFixed(3) + 'rpm<br>' + 
                            '幅值：' + params.value['X1Mag'].toFixed(3) + data.RangeUnit + '<br>'
                            + '相位：' + params.value['X1P'] + '°'
                        );
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
                angleAxis: {
                    type: "value",
                    startAngle: 270,
                    // splitNumber: 36,
                    clockwise: false, //刻度增长逆时针
                    max: 360,
                },
                radiusAxis: {
                    min: 0,
                    max: data.ShaftGap,
                },
                series: [
                    {
                        coordinateSystem: "polar",
                        type: "line",
                        showSymbol: false,
                        emphasis: {
                            itemStyle :{
                                color: 'red',
                                borderColor: 'red',
                                borderWidth: 8
                            }
                        },
                        encode: {
                            radius: 'X1Mag',
                            angle: 'X1P'
                        }
                    },
                ]
            };
            BodeCharts[3].setOption(option3, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
};

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

        BodeStartTime = [];
        BodeStartTime.push({
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
                    BodeStartTime.push({
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