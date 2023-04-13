initName()
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
        var id1 = data.value.substr(0, x)
        var id2 = data.value.substr(x + 1)
        draw(id1)
    });
});
function draw(id) {
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + ":8080/cms/rWaveData/getRWaveData",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        data: {
            MPID: id,
            IndexNum: 1576753367
        },
        success: function (data) {
            console.log(data.data)
            // 指定图表的配置项和数据
            let newData = [];
            for (let i = 0; i < data.data[1].length; i++) {
                newData.push(data.data[1][i].toFixed(2));
              }
            var option = {
                tooltip: {},
                xAxis: {
                    type: 'category',
                    name: "时间/s",
                    nameLocation: 'middle',
                    data: newData
                },
                yAxis: {
                    type: 'value',
                    name: "幅值/g",
                    nameLocation: 'middle',
                    nameGap: 40
                },
                series: [
                    {
                        data: data.data[0],
                        type: 'line',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false,
                        // markPoint: {
                        //     data: [
                        //         {
                        //             x: '90%',
                        //             y: '10%',
                        //             value: "x=0.00s\ny=0.00g",
                        //             symbol: 'roundRect',
                        //             label: {
                        //                 color: '#000'
                        //             },
                        //             itemStyle: {
                        //                 color: 'rgba(255,255,255,0)',
                        //             }
                        //         },
                        //         {
                        //             x: '15%',
                        //             y: '10%',
                        //             value: "峰值：0.026g 有效值0.129g",
                        //             symbol: 'roundRect',
                        //             label: {
                        //                 color: '#000'
                        //             },
                        //             itemStyle: {
                        //                 color: 'rgba(255,255,255,0)',
                        //             }
                        //         }
                        //     ]
                        // },
                    }
                ]
            };
            echarts.init(document.getElementById(id)).setOption(option);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};