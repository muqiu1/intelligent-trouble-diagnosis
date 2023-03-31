layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: '#time1'
        , value: '2019-10-10 06:01:00'
        , isInitValue: true
        , type: 'datetime'
    });
    laydate.render({
        elem: '#time2'
        , value: '2020-02-10 14:01:00'
        , isInitValue: true
        , type: 'datetime'
    });
});
new Promise(function (resolve, reject) {
    layui.use('laytpl', function () {
        var laytpl = layui.laytpl
        var getTpl = demo.innerHTML
        var view = document.getElementById('view');
        var tableData = {
            'list': checkedList
        }
        laytpl(getTpl).render(tableData, function (html) {
            view.innerHTML = html;
        });
    });
    resolve();
}).then(function () {
    layui.use(['form'], function () {
        var $ = layui.$
        var form = layui.form;
        form.render('select')
        $(document).ready(function () {
            for (var i = 0; i < checkedList.length; i++) {
                draw(checkedList[i].id);
            }
        })
    });
})
layui.use('form', function () {
    var form = layui.form;

    //监听提交
    form.on('select()', function (data) {
        var x = data.value.indexOf('_')
        var id1 = data.value.substr(0,x)
        var id2 = data.value.substr(x+1)
        draw(id1)
    });
});
function draw(id) {
    // echarts
    var data = [];
    for (let i = 0; i < 300; i++) {
        if (i%19==0){ data[i] = [i/300, 0] }
        else if (i%19==1){ data[i] = [i/300, 0.01] }
        else if (i%19==2){ data[i] = [i/300, 0] }
        else if (i%19==3){ data[i] = [i/300, 0.01 + (Math.random()-0.5)/500] }
        else if (i%19==4){ data[i] = [i/300, 0.015 + (Math.random()-0.5)/500] }
        else if (i%19==5){ data[i] = [i/300, 0.026 + (Math.random()-0.5)/500] }
        else if (i%19==6){ data[i] = [i/300, 0.026 + (Math.random()-0.5)/500] }
        else if (i%19==7){ data[i] = [i/300, 0] }
        else if (i%19==8){ data[i] = [i/300, 0] }
        else if (i%19==9){ data[i] = [i/300, 0] }
        else if (i%19==10){ data[i] = [i/300, 0] }
        else if (i%19==11){ data[i] = [i/300, 0] }
        else if (i%19==12){ data[i] = [i/300, 0] }
        else if (i%19==13){ data[i] = [i/300, 0] }
        else if (i%19==14){ data[i] = [i/300, 0] }
        else if (i%19==15){ data[i] = [i/300, 0] }
        else if (i%19==16){ data[i] = [i/300, -0.02 + (Math.random()-0.5)/500] }
        else if (i%19==17){ data[i] = [i/300, -0.023 + (Math.random()-0.5)/500] }
        else if (i%19==18){ data[i] = [i/300, -0.06 + (Math.random()-0.5)/500] }
    }
    // 指定图表的配置项和数据
    var option = {
        tooltip: {},
        xAxis: {
            type: 'value',
            name: "时间/s",
            nameLocation: 'middle'
        },
        yAxis: {
            type: 'value',
            name: "幅值/g",
            nameLocation: 'middle',
            max: 0.04,
            min: -0.08,
            nameGap: 40
        },
        series: [
            {
                data: data,
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
                            value: "x=0.00s\ny=0.00g",
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
                            y: '10%',
                            value: "峰值：0.026g 有效值0.129g",
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
    echarts.init(document.getElementById(id)).setOption(option);
};