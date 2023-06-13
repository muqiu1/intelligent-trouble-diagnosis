initName()
var TimeDomainCharts = {};
var TimeDomainLastTime = {};
layui.use(['laytpl', 'form', 'layer'], function () {
    var laytpl = layui.laytpl
        , $ = layui.$
        , form = layui.form
        , layer = layui.layer;
    var loadingLayer;
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5,'#fff'],
            time: 5*1000
        });
        var getTpl = demo.innerHTML
        var view = document.getElementById('view');
        var tableData = {
            'list': checkedList
        }
        laytpl(getTpl).render(tableData, function (html) {
            view.innerHTML = html;
        });
        if (checkedList.length == 2) {
            for (var i = 0; i < checkedList.length; i++) {
                document.getElementById(checkedList[i].id).style.height = 630 + "px";
            }
        }
        else if (checkedList.length == 1) {
            var elem = document.getElementById(checkedList[0].id);
            elem.style.height = 630 + "px";
            elem = elem.parentElement.parentElement.parentElement;
            elem.style.width = 100 + "%";
        }
        resolve();
    }).then(function () {
        form.render('select')
        TimeDomainCharts = {};
        for (var i = 0; i < checkedList.length; i++) {
            checkedList[i].drawId = checkedList[i].id;
            TimeDomainCharts[checkedList[i].id] = echarts.init(document.getElementById(checkedList[i].id));
            TimeDomainLastTime[checkedList[i].id] = 0;
        }
    }).then(function () {
        $(document).ready(function () {
            form.val("drawTimeDomainTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(drawTimeDomainRealTime);
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
                    for (var i = 0; i < checkedList.length; i++) {
                        drawTimeDomain(checkedList[i].id, checkedList[i].id);
                    }
                }
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
    
    //监听提交
    form.on('select(changeTimeDomain)', function (data) {
        var x = data.value.indexOf('_')
        var id1 = parseInt(data.value.substr(0, x))
        var id2 = parseInt(data.value.substr(x + 1))
        TimeDomainLastTime[id1] = 0;
        if (intervalId == 0){
            drawTimeDomain(id1, id2)
        }
        else{
            drawTimeDomain(id1, id2, "_RealTime");
        }
        for (var i = 0; i < checkedList.length; i++) {
            if (checkedList[i].id == id1) {
                checkedList[i].drawId = id2
            }
        }
    });

    function drawTimeDomainRealTime(){
        for (var i = 0; i < checkedList.length; i++) {
            drawTimeDomain(checkedList[i].id, checkedList[i].drawId, "_RealTime");
        }
    }

    form.on('radio(drawTimeDomainType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(drawTimeDomainRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function drawTimeDomain(id, MPID, urlRealTime='') {
    let endTime = parseInt(new Date().getTime()/1000);
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getRWaveData" + urlRealTime,
        contentType: "application/x-www-form-urlencoded",
        // async: false,
        dataType: "json",
        data: {
            MPID: MPID,
            IndexNum: checkedTime,
            startTime : 1576753367,
            endTime: endTime,
            pageNum: 1,
            pageSize: 1,
            LastTime: TimeDomainLastTime[id],
        },
        success: function (res) {
            let data = res.data;
            if (data.indexNum == TimeDomainLastTime[id]){
                console.log(data.indexNum);
                return;
            }
            console.log(data.indexNum, data.data[0].length)
            TimeDomainLastTime[id] = data.indexNum;
            // 指定图表的配置项和数据
            let newData = [];
            for (let i = 0; i < data.data[1].length; i++) {
                newData.push([data.data[1][i], data.data[0][i]]);
            }
            var option = {
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
                    max: 'dataMax',
                    axisLabel: {
                        showMaxLabel: false,
                    }
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/" + data.RangeUnit,
                    nameLocation: 'middle',
                    nameGap: 30
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
            TimeDomainCharts[id].setOption(option, true);
            document.getElementById(id+'Time').innerHTML = new Date(data.indexNum*1000).toLocaleString().split('/').join('-');
            document.getElementById(id+'rotSpeed').innerHTML = data.rotSpeed;
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};