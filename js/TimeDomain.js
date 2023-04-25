initName()
var TimeDomainCharts = {};
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
        resolve();
    }).then(function () {
        form.render('select')
        TimeDomainCharts = {};
        for (var i = 0; i < checkedList.length; i++) {
            TimeDomainCharts[checkedList[i].id] = echarts.init(document.getElementById(checkedList[i].id));
        }
    }).then(function () {
        $(document).ready(function () {
            for (var i = 0; i < checkedList.length; i++) {
                drawTimeDomain(checkedList[i].id, checkedList[i].id);
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });
})

layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('select(changeTimeDomain)', function (data) {
        var x = data.value.indexOf('_')
        var id1 = data.value.substr(0, x)
        var id2 = data.value.substr(x + 1)
        drawTimeDomain(parseInt(id1), parseInt(id2))
    });
    form.on('radio(drawType', function (data) {
        if (data.value == "0"){
            console.log(data);
        }
    });
});
function drawTimeDomain(id, MPID) {
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getRWaveData",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        data: {
            MPID: MPID,
            IndexNum: checkedTime
        },
        success: function (data) {
            console.log(data.data)
            // 指定图表的配置项和数据
            let newData = [];
            for (let i = 0; i < data.data[1].length; i++) {
                newData.push([data.data[1][i], data.data[0][i]]);
            }
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
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
                    // data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/g",
                    nameLocation: 'middle',
                    nameGap: 40
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
            document.getElementById(id+'Time').innerHTML = new Date(checkedTime*1000).toLocaleString().split('/').join('-');
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};