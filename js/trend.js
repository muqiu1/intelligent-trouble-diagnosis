initName();
var datasetTrend = { "有效值": [] };

var tableTrend;
layui.use(['form'], function () {
    var form = layui.form;
    //此处即为 checkbox 的监听事件
    form.on('checkbox(trend)', function (obj) {
        var title = obj.elem.title
        if (title == '峰峰值') {
            var data = [];
            var r = 10 * Math.random()
            for (let i = 0; i < 1000; i++) {
                data[i] = [datasetTrend['峰值'][i][0], datasetTrend['峰值'][i][1] * 2];
            }
            datasetTrend[title] = data;
        }
        else if (datasetTrend[title] == null) {
            var data = [];
            var r = 0.045
            for (let i = 0; i < 1000; i++) {
                if (i > 650) {
                    if (i < 730) {
                        r = 0.051
                    }
                    else {
                        r = 0.047
                    }
                }
                data[i] = [new Date(1671000649685 + i * 50000).toLocaleString(), r + Math.random() * 0.005];
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
                type: 'category',
                name: "时间/年-月-日 时：分",
                nameLocation: 'middle',
                nameGap: 40
            },
            yAxis: {
                type: 'value',
                name: "值/g",
                nameLocation: 'middle',
                nameGap: 40,
                min: 0,
                max: 0.15
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
function drawTrend() {
    tableTrend = echarts.init(document.getElementById("trend"))
    // echarts
    var data = [];
    var r = 0.045
    for (let i = 0; i < 1000; i++) {
        if (i > 650) {
            if (i < 730) {
                r = 0.051
            }
            else {
                r = 0.047
            }
        }
        data[i] = [new Date(1671000649685 + i * 50000).toLocaleString(), r + Math.random() * 0.005];
    }
    datasetTrend["有效值"] = data;
    // 指定图表的配置项和数据
    var option = {
        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        xAxis: {
            type: 'category',
            name: "时间/年-月-日 时：分",
            nameLocation: 'middle',
            nameGap: 40
        },
        yAxis: {
            type: 'value',
            name: "值/g",
            nameLocation: 'middle',
            nameGap: 40,
            min: 0,
            max: 0.15
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