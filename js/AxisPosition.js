// initName();
var AxisPositionCharts = {};
var AxisPositionStartTime = [];
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
        
        laydate.render({
            elem: '#index-range',
            range: ['#StartIndex', '#EndIndex'],
            type: 'datetime',
        });

        form.val("getStartSearchTime", {
            startTime : searchTime.startTime,
            endTime : searchTime.endTime
        })

        AxisPositionStartTime.push({
            startTime: (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000,
            endTime: (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000,
        })

        let slct2 = document.getElementsByName('start-end');
        for (var k = 0; k < slct2.length; k++) {
            var op1 = document.createElement("option");
            op1.setAttribute('value', 0)
            op1.setAttribute('selected', true);
            op1.innerHTML = searchTime.startTime + " ~ " + searchTime.endTime;
            slct2[k].appendChild(op1);
        }

        layui.use(['form'], function () {
            layui.form.render('select')
            layui.form.render('checkbox')
            layui.form.render('radio')
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawAxisPositionTypeForm", { status: drawType});
            if ( drawType == "0"){
                switchFormDisabled(true)
                startTimer(drawAxisPositionRealTime);
            }
            else{
                switchFormDisabled(false)
                drawAxisPosition();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeAxisPosition)', function (data) {
        drawAxisPosition();
    });
    form.on('select(changeAxisPositionStartTime)', function (data) {
        drawAxisPosition();
    });

    function drawAxisPositionRealTime(){
        drawAxisPosition();
    }

    form.on('radio(drawAxisPositionType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            switchFormDisabled(true)
            startTimer(drawAxisPositionRealTime);
        }
        else{
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

function drawAxisPosition() {
    if ( JSON.stringify(checkedGroup) === "{}" ){
        layer.alert('当前没有可查询的轴心对', {
            icon: 0,
            shadeClose: true,
            title: "提示",
        })
        return;
    }
    let startSearchTime = layui.form.val("getStartSearchTime");
    let MPX = checkedGroup[layui.form.val("AxisPositionSelect").sss].MPX;
    let MPY = checkedGroup[layui.form.val("AxisPositionSelect").sss].MPY;
    let endTime = intervalId == 0? AxisPositionStartTime[ startSearchTime["start-end"] ].endTime : parseInt(new Date().getTime()/1000);
    let startTime = intervalId == 0? AxisPositionStartTime[ startSearchTime["start-end"] ].startTime : endTime - 3600;
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
            console.log(data.indexNum, data.data[0].length)
            // 指定图表的配置项和数据
            document.getElementById('AxisPositionSTime').innerHTML = new Date(startTime * 1000).toLocaleString('chinese',{hour12: false}).split('/').join('-');
            document.getElementById('AxisPositionETime').innerHTML = new Date(endTime * 1000).toLocaleString('chinese',{hour12: false}).split('/').join('-');
            document.getElementById('rotSpeed').innerHTML = data.rotSpeed;
            let data1 = [];
            for (let i = 0; i < data.xTime.length; i++) {
                data1.push([data.xTime[i]*1000, data.gapx[i]]);
            }
            var option1 = {
                title: {
                    text: 'X向间隙电压'
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
                    name: "电压/" + data.RangeUnit,
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
                title: {
                    text: 'Y向间隙电压'
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
                    name: "电压/" + data.RangeUnit,
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
                title: {
                    text: '轴心位置'
                },
                textStyle: {
                    fontSize: 15
                },
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
                    formatter: function (params) {
                        params = params[0];
                        return (
                            '幅值：' + params.value[0].toFixed(3) + data.RangeUnit + '<br>'
                            + '相位：' + params.value[1].toFixed(3) + '°'
                        );
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        restore: {},
                        saveAsImage: {
                            name: new Date().toLocaleString('chinese',{hour12: false}).split('/').join('-'),
                        }
                    }
                },
                angleAxis: {
                    type: "value",
                    startAngle: 270,
                    // splitNumber: 36,
                    clockwise: false, //刻度增长逆时针
                    min: 0,
                    max: 360,
                },
                radiusAxis: {
                    min: 0,
                    max: data.ShaftGap,
                },
                series: [
                    {
                        coordinateSystem: "polar",
                        name: "轴心轨迹",
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

function getAxisPositionStartTimeList(){
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

        AxisPositionStartTime = [];
        AxisPositionStartTime.push({
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
                    AxisPositionStartTime.push({
                        startTime: res.data[i].StartIndex,
                        endTime: res.data[i].EndIndex,
                    })
                    for (var k = 0; k < slct.length; k++) {
                        var op = document.createElement("option");
                        op.setAttribute('value', i+1 );
                        op.innerHTML = "启停分析："+ new Date( res.data[i].StartIndex*1000 ).toLocaleString('chinese',{hour12: false}).split('/').join('-') + " ~ " + new Date( res.data[i].EndIndex*1000 ).toLocaleString('chinese',{hour12: false}).split('/').join('-');
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