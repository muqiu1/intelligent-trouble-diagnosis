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
initName();
// echarts
var _table1 = echarts.init(document.getElementById('table1'));
var _table1_ = echarts.init(document.getElementById('table1_'));
var _table2 = echarts.init(document.getElementById('table2'));
var data1 = [];
for (let i = 0; i < 300; i++) {
    // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
    data1[i] = [i, Math.ceil(Math.random() * 15)];
}
// var max = Math.max.apply(Math,data1);
var data2 = [];
for (let i = 0; i < 300; i++) {
    // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
    data2[i] = [i, Math.ceil(Math.random() * 300) - 150];
}
// 指定图表的配置项和数据
var option1 = {
    xAxis: {
        type: 'value',
        name: "时间/Hz",
        nameLocation: 'middle'
    },
    yAxis: {
        type: 'value',
        name: "电压/g",
        nameLocation: 'middle'
    },
    series: [
        {
            data: data1,
            type: 'line',
            lineStyle: {
                color: 'blue'
            },
            showSymbol: false,
            markPoint: {
                data: [
                    {
                        x: '90%',
                        y: '10%',
                        value: "X:--\nY:--V",
                        symbol: 'roundRect',
                        label: {
                            color: '#000'
                        },
                        itemStyle: {
                            color: 'rgba(255,255,255,0)',
                        }
                    },
                    {
                        x: '15%',
                        y: '5%',
                        value: "外相间隙电压 ",
                        symbol: 'roundRect',
                        label: {
                            color: '#000'
                        },
                        itemStyle: {
                            color: 'rgba(255,255,255,0)',
                        }
                    }
                ]
            },
        }
    ]
};
data = [];
for (let i = 0; i <= 360; i++) {
    //data[i]=[10 * (1 - Math.sin((Math.PI / 180) * i)), i];
    data[i] = [10 * (1), i];
}
var option2 = {
    polar: {
        center: ["50%", "50%"]
    },
    angleAxis: {
        // show: false,
        type: "value",
        startAngle: 270,
        splitNumber: 36,
        clockwise: false //刻度增长逆时针
    },
    radiusAxis: {
        // show: false,
        min: 0,
        max: 13,
        // inverse: true
    },
    // animationDuration: 2000,
    series: [
        {
            coordinateSystem: "polar",
            name: "line",
            type: "line",
            showSymbol: false,
            data: data
        },
        {
            coordinateSystem: "polar",
            name: "line",
            type: "scatter",
            showSymbol: false,
            // data: [data,[5.5,30]]
            symbolSize: 15,
            itemStyle: {
                color: '#ff0000'
            },
            data: [[9, 320]]
        }
    ]
};
// 使用刚指定的配置项和数据显示图表。
_table1.setOption(option1);
_table1_.setOption(option1);
_table2.setOption(option2);