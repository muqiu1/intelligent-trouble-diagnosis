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
var data = [];
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
    // var parameter ={};
    // layui.$.ajax({
    //     type: 'POST',
    //     url: "http://192.168.10.104:8080/cms/user/list",
    //     contentType: "application/json",
    //     async: false,
    //     dataType: "json",
    //     data: parameter,
    //     success: function (res) {
    //         data = res.data.list
    //     },
    //     error: function () {
    //         console.log(2)
    //     }
    // })
    resolve();
}).then(function () {
    layui.use(['form'], function () {
        var $ = layui.$
        var form = layui.form;
        form.render('select')
        console.log(data)
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
    form.on('select()', function (res) {
        var x = res.value.indexOf('_')
        var id1 = res.value.substr(0, x)
        var id2 = res.value.substr(x + 1)
        draw(id1)
    });
});
function draw(id) {
    // echarts
    var data = [];
    for (let i = 0; i < 300; i++) {
        // data[i] = [i, 2 * Math.sin(i*Math.PI/10) -1];
        data[i] = [i, Math.trunc(50 * Math.sin(i) * Math.cos(i * 2 + 1) * Math.sin(i * 3 + 2))];
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
            nameLocation: 'middle'
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
                            value: "峰值：0.00g 有效值0.00g",
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