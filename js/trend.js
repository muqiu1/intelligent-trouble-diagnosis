initName();
var datasetTrend = { "有效值": [] };
var TrendCharts = null;
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
        TrendCharts = null;
        TrendCharts = echarts.init(document.getElementById("trend"));
        resolve();
    }).then(function () {
        $(document).ready(function () {
            drawTrend();
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
})

layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('select(trend)', function (data) {
        drawTrend();
    });
  
    form.on('checkbox(trend)', function (data) {
        drawTrend();
    });
  
    function drawTrendRealTime(){
        drawTrend();
    }
  
    form.on('radio(drawTrendType)', function (data) {
        if (data.value == "0"){
            startTimer(drawTrendRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function drawTrend() {
    let searchTime = layui.form.val("getSearchTime");
    let YAxis = layui.form.val("trendY");
    let MPID = parseInt(YAxis.sss);
    var checkedY = document.getElementsByName("Y");
    let y = [];
    for (var i = 0; i< checkedY.length; i++){
        if (checkedY[i].checked){
            // y[ checkedY[i].value ] = checkedY[i].title;
            y.push(checkedY[i].value);
        }
    }
    let endTime = intervalId == 0? (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000 : parseInt(new Date().getTime()/1000) + 28800;
    let startTime = intervalId == 0? (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000 : endTime - 3600;
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rVibData/getTrend",
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        traditional: true,
        data: {
            MPID: MPID,
            yAxisList : y,
            startTime : startTime,
            endTime: endTime,
        },
        success: function (res) {
            let data = res.data;
            console.log(data.data.length)
            // 指定图表的配置项和数据
            document.getElementById('sTime').innerHTML = new Date(startTime * 1000).toLocaleString().split('/').join('-');
            document.getElementById('eTime').innerHTML = new Date(endTime * 1000).toLocaleString().split('/').join('-');
            let seriesList = [];
            for (let i = 0; i < y.length; i++) {
                seriesList.push(
                    {
                        type: 'line',
                        name: rvibdataTable[ y[i] ],
                        lineStyle: {
                            // color: 'blue'
                        },
                        showSymbol: false,
                        encode: {
                            x : "IndexNum",
                            y : y[i]
                        }
                    })
            }
            for (let i = 0; i < data.data.length; i++) {
                data.data[i].IndexNum = data.data[i].IndexNum*1000;
            }
            var option1 = {
                legend: {
                    show : true,
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 30,
                    bottom: 20,
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
                },
                yAxis: {
                    type: 'value',
                    name: "值",
                    nameLocation: 'middle',
                    nameGap: 30,
                    // max: function (value) {
                    //   return Math.ceil(value.max * 10) / 10;
                    // },
                    // min: function (value) {
                    //   return Math.floor(value.min * 10) / 10;
                    // }
                },
                series: seriesList
            };
            TrendCharts.setOption(option1, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
};