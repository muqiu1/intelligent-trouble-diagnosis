initName();
var TrendCharts = {};
var TrendGroup = {
    "PPV" : 1,
    "PV" : 1,
    "RMS" : 1,
    "Gap" : 2,
    "FZYZ" : 2,
    "PDYZ" : 2,
    "QDYZ" : 2,
    "YDYZ" : 2,
    "MCYZ" : 2,
    "BXYZ" : 2,
    "HalfMag" : 1,
    "HalfP" : 3,
    "X1Mag" : 1,
    "X1P" : 3,
    "X2Mag" : 1,
    "X2P" : 3,
    "X3Mag" : 1,
    "X3P" : 3,
    "X4Mag" : 1,
    "RotSpeed" : 4,
    "LDZB": 2,
}
var y = [];
layui.use(['form', 'layer'], function () {
    var $ = layui.$
        , form = layui.form
        , layer = layui.layer;
    var loadingLayer;
    var option = {
        legend: {
            show : true,
            type: 'scroll',
            orient: 'horizontal',
            top: 10,
            left: 'center',
        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    precision : 3,
                    backgroundColor: '#6a7985'
                }
            },
            formatter : function (params) {
                let param = params[0];
                // console.log(param);
                let html = [new Date(param.data.IndexNum).toLocaleString('chinese',{hour12: false}).split('/').join('-') + '<hr size=1 style="margin: 3px 0">'];
                for (let i=0; i<y.length; i++){
                    html.push( rvibdataTable[ y[i] ] + ': ' + param.data[ y[i] == "LDZB"? "RMS" : y[i] ].toFixed(3) + '<br/>');
                }
                return html.join('');
            }
        },
        toolbox: {
            show: true,
            feature: {
                // dataZoom: {
                //     //   yAxisIndex: 'none'
                // },
                // restore: {},
                saveAsImage: {
                    name: new Date().toLocaleString('chinese',{hour12: false}).split('/').join('-'),
                }
            },
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
        }
    };
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5, '#fff'],
            time: 5 * 1000
        });
        for (var i = 1; i <= 4; i++) {
            TrendCharts[i] = echarts.init(document.getElementById("trend" + i));
            TrendCharts[i].setOption(option);
        }
        TrendCharts[1].setOption({
            yAxis: {
                type: 'value',
                name: "幅值",
                nameLocation: 'middle',
                nameGap: 30,
            }
        });
        TrendCharts[2].setOption({
            yAxis: {
                type: 'value',
                name: "值",
                nameLocation: 'middle',
                nameGap: 30,
            }
        });
        TrendCharts[3].setOption({
            yAxis: {
                type: 'value',
                name: "相位/°",
                nameLocation: 'middle',
                nameGap: 30,
            }
        });
        TrendCharts[4].setOption({
            yAxis: {
                type: 'value',
                name: "转速/rpm",
                nameLocation: 'middle',
                nameGap: 30,
            }
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("drawTrendTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawTrendRealTime);
            }
            else{
                drawTrend();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
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
        drawType = data.value;
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
    y = [];
    let seriesList = { 1: [], 2: [], 3: [], 4:[] };
    for (var i = 0; i< checkedY.length; i++){
        if (checkedY[i].checked){
            // y[ checkedY[i].value ] = checkedY[i].title;
            y.push(checkedY[i].value);
        }
    }
    for (let i = 0; i < y.length; i++) {
        seriesList[ TrendGroup[ y[i] ] ].push(
            {
                type: 'line',
                name: rvibdataTable[ y[i] ],
                lineStyle: {
                    // color: 'blue'
                },
                showSymbol: false,
                encode: {
                    x : "IndexNum",
                    y : y[i] == "LDZB"? "RMS" : y[i]
                }
            }
        )
    }
    let endTime = intervalId == 0? (new Date(searchTime.endTime.split('-').join('/')).getTime())/1000 : parseInt(new Date().getTime()/1000);
    let startTime = intervalId == 0? (new Date(searchTime.startTime.split('-').join('/')).getTime())/1000 : endTime - 3600;
    let ytemp = y.filter(function (item) {
        return item != "LDZB";
    });
    if ( y.includes("LDZB") && !ytemp.includes("RMS")){
        ytemp.push("RMS");
    }
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rVibData/getTrend",
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        traditional: true,
        data: {
            MPID: MPID,
            yAxisList : ytemp,
            startTime : startTime,
            endTime: endTime,
        },
        success: function (res) {
            let data = res.data;
            console.log(data.data.length)
            // 指定图表的配置项和数据
            document.getElementById('TrendSTime').innerHTML = new Date(startTime * 1000).toLocaleString('chinese',{hour12: false}).split('/').join('-');
            document.getElementById('TrendETime').innerHTML = new Date(endTime * 1000).toLocaleString('chinese',{hour12: false}).split('/').join('-');
            for (let i = 0; i < data.data.length; i++) {
                data.data[i].IndexNum = data.data[i].IndexNum*1000;
            }
            let connects = [];
            for (var i = 1; i <= 4; i++) {
                if (seriesList[i].length == 0){
                    document.getElementById("trend" + i).style.display = "none";
                    continue;
                }
                else{
                    connects.push(TrendCharts[i]);
                    document.getElementById("trend" + i).style.display = "block";
                    if (i == 1){
                        TrendCharts[i].setOption({
                            yAxis: {
                                type: 'value',
                                name: "幅值/" + data.RangeUnit,
                                nameLocation: 'middle',
                                nameGap: 30,
                            },
                            dataset: {
                                source: data.data,
                            },
                            series: seriesList[i],
                        },
                        {
                            replaceMerge: ['yAxis','dataset', 'series']
                        });
                    }
                    else{
                        TrendCharts[i].setOption({
                            dataset: {
                                source: data.data,
                            },
                            series: seriesList[i],
                        }, 
                        {
                            replaceMerge: ['dataset', 'series']

                        });
                    }
                }
            }
            echarts.connect(connects);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    });
};