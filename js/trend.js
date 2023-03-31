var datasetTrend = { "有效值": [] };

var tableTrend;
layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: '#time1'
        , value: '2022-11-22 17:03:22'
        , isInitValue: true
        , type: 'datetime'
    });
    laydate.render({
        elem: '#time2'
        , value: '2022-11-22 17:03:22'
        , isInitValue: true
        , type: 'datetime'
    });
});
layui.use(['form'], function () {
    var form = layui.form;
    //此处即为 checkbox 的监听事件
    form.on('checkbox(trend)', function (obj) {
        var title = obj.elem.title
        if (datasetTrend[title] == null) {
            var data = [];
            var r = 10 * Math.random()
            for (let i = 0; i < 300; i++) {
                data[i] = [i, 10 * Math.sin(i) * Math.cos(i * 2 + 1) * Math.sin(i * 3 + 2) + r];
            }
            datasetTrend[title] = data;
        }
        else {
            delete datasetTrend[title];
        }
        var option = {
            tooltip: {
                trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'value',
                name: "时间/年-月-日 时：分",
                nameLocation: 'middle'
            },
            yAxis: {
                type: 'value',
                name: "值/g",
                nameLocation: 'middle'
            },
            series: []
        };
        for (var key in datasetTrend) {
            option.series.push({
                name: key,
                data: datasetTrend[key],
                type: 'line',
                showSymbol: false
            })
        }
        tableTrend.setOption(option, true);
    });
});
drawTrend();
initName();

function drawTrend() {
    tableTrend = echarts.init(document.getElementById("trend"))
    // echarts
    var data = [];
    for (let i = 0; i < 300; i++) {
        // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
        data[i] = [i, Math.trunc(10 * Math.sin(i) * Math.cos(i * 2 + 1) * Math.sin(i * 3 + 2))];
    }
    datasetTrend["有效值"] = data;
    // 指定图表的配置项和数据
    var option = {
        tooltip: {},
        xAxis: {
            type: 'value',
            name: "时间/年-月-日 时：分",
            nameLocation: 'middle'
        },
        yAxis: {
            type: 'value',
            name: "值/g",
            nameLocation: 'middle'
        },
        series: [
            {
                name: "有效值",
                data: data,
                type: 'line',
                showSymbol: false,
            }
        ]
    };
    tableTrend.setOption(option);
};