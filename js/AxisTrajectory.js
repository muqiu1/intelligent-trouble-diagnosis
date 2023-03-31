
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
        name: "时间/s",
        nameLocation: 'middle',

    },
    yAxis: {
        type: 'value',
        name: "幅值/mm",
        nameLocation: 'middle',
        max: 18
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
                        x: '15%',
                        y: '5%',
                        value: "X相时域波形 ",
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
var option2 = {
    xAxis: {
        type: 'value',
        name: "时间/s",
        nameLocation: 'middle',

    },
    yAxis: {
        type: 'value',
        name: "幅值/mm",
        nameLocation: 'middle',
        max: 18
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
                        x: '15%',
                        y: '5%',
                        value: "Y相时域波形 ",
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
var data = [];
for (let i = 0; i <= 360; i++) {
    //data[i]=[10 * (1 - Math.sin((Math.PI / 180) * i)), i];
    data[i] = [15 * Math.cos((Math.PI / 180) * i), 10 * Math.sin((Math.PI / 180) * i)];    //此处生成椭圆数据
}
var option3 = {
    xAxis: {
        type: 'value',
        name: "X幅值/s",
        nameLocation: 'middle',
        max: 18,
        min: -18
    },
    yAxis: {
        type: 'value',
        name: "Y幅值/mm",
        nameLocation: 'middle',
        max: 12,
        min: -12
    },
    series: [
        {
            data: data,
            type: 'line',
            lineStyle: {
                color: 'blue'
            },
            showSymbol: false,
        }
    ]
};
// 使用刚指定的配置项和数据显示图表。
_table1.setOption(option1);
_table1_.setOption(option2);
_table2.setOption(option3);
layui.use(['layer', 'form'], function () {
    var form = layui.form;
    //此处即为 radio 的监听事件
    form.on('radio(*)', function (obj) {
        // layer.msg('触发了事件3');
        // var $ = layui.$
        // var data = $(obj.elem);
        // var axis_name = data[0].title
        // var axis = data[0].name
        // var data = option1.series[0].data     //注意此处要加上[0]
        // var data_rest = [];  
        //生成随机数组    
        data = [];
        r1 = 15 * Math.random()
        r2 = 10 * Math.random()
        for (let i = 0; i <= 360; i++) {
            data[i] = [r1 * Math.cos((Math.PI / 180) * i), r2 * Math.sin((Math.PI / 180) * i)];    //此处生成椭圆数据
        }
        option3.series[0].data = data
        _table2.clear();
        _table2.setOption(option3, true);
    }
    );
});