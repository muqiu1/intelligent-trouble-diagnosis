initName();
var FFTCharts = {};
layui.use(['form', 'layer'], function () {
    var $ = layui.$
        , form = layui.form
        , layer = layui.layer;
    var loadingLayer;
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5,'#fff'],
            time: 5*1000
        });
        FFTCharts = {};
        for (var i = 1; i <= 3; i++) {
            FFTCharts[i] = echarts.init(document.getElementById("FFT"+i));
        }
        console.log(FFTCharts)
        resolve();
    }).then(function () {
        drawTF(checkedList[0].id);
    }).then(function () {
        layer.close(loadingLayer)
    });
})

layui.use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('select(changeMPID)', function (data) {
        var id1 = data.value
        drawTF(parseInt(id1))
    });
});

// drawFFT(checkedList[0].id);
function drawTF(MPID) {
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
            FFTCharts[1].setOption(option, true);
            FFTCharts[2].setOption(option, true);
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
};

function drawFFT() {
    let FFTparameter = layui.form.val("FFTparameter");
    let FFTselect = layui.form.val("FFTselect");
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rWaveData/getStft",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        data: {
            MPID: parseInt(FFTselect.sss),
            IndexNum: checkedTime,
            windowWidth: parseInt(FFTparameter.windowWidth),
            windowType: parseInt(FFTparameter.windowType),
        },
        success: function (data) {
            console.log(data.data)
            
            let data3 = [];
            for (let i = 0; i < data.data[0].length; i++) {
                for (let j = 0; j< data.data[0][i].length; j++) {
                    data3.push([data.data[0][i][j], data.data[2][0][i], data.data[1][i][j]]);
                }
            }
            var option3d = {
                tooltip: {},
                xAxis3D: {
                    type: 'value',
                    name: "频率/s",
                    nameLocation: 'middle'
                },
                yAxis3D: {
                    type: 'value',
                    name: "时间/s",
                    nameLocation: 'middle'
                },
                zAxis3D: {
                    type: 'value',
                    name: "幅值/g",
                    nameLocation: 'middle'
                },
                grid3D: {
                    viewControl: {
                        projection: 'orthographic'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        restore: {},
                        saveAsImage: {
                            name: new Date().toLocaleString().split('/').join('-'),
                        }
                    }
                },
                series: [
                    {
                        data: data3,
                        type: 'line3D',
                        lineStyle: {
                            color: 'blue'
                        },
                        showSymbol: false
                    }
                ]
            };
            FFTCharts[3].setOption(option3d, true);
            document.getElementById('Time').innerHTML = new Date(checkedTime*1000).toLocaleString().split('/').join('-');
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
}