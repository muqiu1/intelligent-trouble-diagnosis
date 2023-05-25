layui.use([], function () {
    var $ = layui.$

    var characterList = [];
    var faultList = [];
    var ruleList = [];
    var KnowledgeGraphChart = echarts.init(document.getElementById('KnowledgeGraph'));
    var option;
    var color = [
        '#c23531',
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#c4ccd3',
        '#dd6b66',
        '#759aa0',
        '#e69d87',
        '#8dc1a9',
        '#ea7e53',
        '#eedd78',
        '#73a373',
        '#73b9bc',
        '#7289ab',
        '#91ca8c',
        '#f49f42',
        '#37A2DA',
        '#32C5E9',
        '#67E0E3',
        '#9FE6B8',
        '#FFDB5C',
        '#ff9f7f',
        '#fb7293',
        '#E062AE',
        '#E690D1',
        '#e7bcf3',
        '#9d96f5',
        '#8378EA',
        '#96BFFF'
    ];

    new Promise(function (resolve, reject) {
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/character/list",
            data: {},
            contentType: "application/x-www-form-urlencoded",
            async: false,
            dataType: "json",
            success: function (res) {
                let data = res.data;
                characterList = data.data;
            },
            error: function () {
                console.log("AJAX ERROR!")
            }
        })
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/fault/list",
            data: {},
            contentType: "application/x-www-form-urlencoded",
            async: false,
            dataType: "json",
            success: function (res) {
                let data = res.data;
                faultList = data.data;
            },
            error: function () {
                console.log("AJAX ERROR!")
            }
        })
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/rule/list",
            data: {},
            contentType: "application/x-www-form-urlencoded",
            async: false,
            dataType: "json",
            success: function (res) {
                let data = res.data;
                ruleList = data.data;
            },
            error: function () {
                console.log("AJAX ERROR!")
            }
        })
        // KnowledgeGraphChart.setOption(option);
        resolve();
    }).then(function () {
        // console.log(characterList[0]);
        // console.log(faultList[0]);
        // console.log(ruleList[0]);

        let data = [];
        var links = [];
        var characterTable = {};
        var colorTable = {};
        var x_min = 0;
        var d = 150;
        for (var i = 0; i < characterList.length; i++) {
            data.push({
                name: '征兆' + characterList[i].CharacterID,
                // y: x_min + (x_max - x_min) * i / (characterList.length - 1),
                y: x_min + d * i,
                x: 0,
                value: characterList[i].CharacterName,
                symbol: 'circle',
                symbolSize: [15, 7],
                label: {
                    show: true,
                    fontSize: 15,
                    formatter: '{c}'
                },
                itemStyle: {
                    color: color[i % color.length],
                }
            })
            characterTable[ characterList[i].CharacterID ] = i;
        }
        var x_max = x_min + d * (characterList.length - 1);
        for (var i = 0; i < faultList.length; i++) {
            data.push({
                name: '故障' + faultList[i].FaultID,
                y: x_min + (x_max - x_min) * i / (faultList.length - 1),
                x: 1500,
                value: faultList[i].FaultName,
                symbol: 'roundRect',
                symbolSize: [20, 9],
                label: {
                    show: true,
                    fontSize: 15,
                    formatter: '{c}'
                },
                itemStyle: {
                    color: color[i % color.length],
                }
            })
            colorTable[ faultList[i].FaultID ] = color[i % color.length];
        }

        for (var i = 0; i < ruleList.length; i++) {
            let ifList = ruleList[i].IF.split(';');
            for (var j = 0; j < ifList.length; j++) {
                let ifItem = ifList[j].split(',');
                links.push({
                    source: '征兆' + ifItem[0],
                    target: '故障' + ruleList[i].Then,
                    value: ifItem[1],
                    label: {
                        show: false
                    },
                    lineStyle: {
                        color: colorTable[ ruleList[i].Then ],
                    }
                })
                data[ characterTable[ ifItem[0] ] ].itemStyle.color = colorTable[ ruleList[i].Then ];
            }
        }
        option = {
            title: {
                text: '知识可视化'
            },
            tooltip: {},
            legend: [{
            }],
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    roam: true,
                    label: {
                        show: false
                    },
                    labelLayout: {
                      hideOverlap: true
                    },
                    edgeSymbol: ['none', 'arrow'],
                    // edgeSymbolSize: [4, 10],
                    // edgeLabel: {
                    //     fontSize: 20
                    // },
                    // center: [0, 0],
                    zoom: 8.5,
                    data: data,
                    links: links,
                    lineStyle: {
                        opacity: 0.5,
                        width: 2,
                        curveness: 0,
                    },
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                            width: 10
                        }
                    },
                }
            ]
        };
        KnowledgeGraphChart.setOption(option);
        KnowledgeGraphChart.on('click', { dataType: 'node' }, function(params) {
            // 关系图的节点被点击时此方法被回调。
            layer.open({
                type: 1,
                area: '800px',
                resize: false,
                shadeClose: true,
                title: params.value,
                content: `
                    <div class="layui-row">
                        <div class="layui-col-md12" id="KnowledgeGraphChild" style="height:600px;"></div>
                    </div>
                  `,
                success: function () {
                    var KnowledgeGraphChildChart = echarts.init(document.getElementById('KnowledgeGraphChild'));
                    let dataChild = [];
                    var linksChild = [];
                    var x_min = 0;
                    var d = 30;
                    if (params.name.slice(0, 2) == '故障') {
                        let ifList = [];
                        for (var i = 0; i < ruleList.length; i++) {
                            if (ruleList[i].Then == params.name.slice(2)) {
                                ifList = ruleList[i].IF.split(';');
                                for (var j = 0; j < ifList.length; j++) {
                                    let ifItem = ifList[j].split(',');
                                    linksChild.push({
                                        source: '征兆' + ifItem[0],
                                        target: '故障' + ruleList[i].Then,
                                        value: ifItem[1],
                                        label: {
                                            show: false
                                        },
                                        lineStyle: {
                                            color: params.color,
                                        }
                                    })
                                }
                                break;
                            }
                        }
                        for (var i = 0; i < ifList.length; i++) {
                            let ifItem = ifList[i].split(',');
                            for (var j = 0; j < characterList.length; j++) {
                                if (characterList[j].CharacterID == ifItem[0]) {
                                    dataChild.push({
                                        name: '征兆' + ifItem[0],
                                        y: x_min + d * i,
                                        x: 0,
                                        value: characterList[j].CharacterName,
                                        symbol: 'circle',
                                        symbolSize: [75, 35],
                                        label: {
                                            show: true,
                                            fontSize: 15,
                                            formatter: '{c}'
                                        },
                                        itemStyle: {
                                            color: params.color,
                                        }
                                    })
                                    break;
                                }
                            }
                        }
                        var x_max = x_min + d * (ifList.length - 1);
                        dataChild.push({
                            name: params.name,
                            y: (x_max + x_min) / 2,
                            x: (x_max + x_min) / 2,
                            value: params.value,
                            symbol: 'roundRect',
                            symbolSize: [100, 48],
                            label: {
                                show: true,
                                fontSize: 15,
                                formatter: '{c}'
                            },
                            itemStyle: {
                                color: params.color,
                            }
                        })
                    }
                    else if (params.name.slice(0, 2) == '征兆'){
                        let FaultIDList = [];
                        for (var i = 0; i < ruleList.length; i++) {
                            let ifList = ruleList[i].IF.split(';');
                            for (var j = 0; j < ifList.length; j++) {
                                let ifItem = ifList[j].split(',');
                                if (ifItem[0] == params.name.slice(2)) {
                                    linksChild.push({
                                        source: '征兆' + ifItem[0],
                                        target: '故障' + ruleList[i].Then,
                                        value: ifItem[1],
                                        label: {
                                            show: false
                                        },
                                        lineStyle: {
                                            color: params.color,
                                        }
                                    })
                                    FaultIDList.push(ruleList[i].Then);
                                    break;
                                }
                            }
                        }
                        var x_max = x_min + d * (FaultIDList.length - 1);
                        dataChild.push({
                            name: params.name,
                            y: (x_max + x_min) / 2,
                            x: 0,
                            value: params.value,
                            symbol: 'circle',
                            symbolSize: [75, 35],
                            label: {
                                show: true,
                                fontSize: 15,
                                formatter: '{c}'
                            },
                            itemStyle: {
                                color: params.color,
                            }
                        })
                        for (var i = 0; i < FaultIDList.length; i++) {
                            for (var j = 0; j < faultList.length; j++) {
                                if (faultList[j].FaultID == FaultIDList[i]) {
                                    dataChild.push({
                                        name: '故障' + FaultIDList[i],
                                        y: x_min + d * i,
                                        x: x_max != 0? (x_max + x_min) / 2 : d,
                                        value: faultList[j].FaultName,
                                        symbol: 'roundRect',
                                        symbolSize: [100, 48],
                                        label: {
                                            show: true,
                                            fontSize: 15,
                                            formatter: '{c}'
                                        },
                                        itemStyle: {
                                            color: params.color,
                                        }
                                    })
                                    break;
                                }
                            }
                        }
                    }

                    var optionChild = {
                        tooltip: {},
                        legend: [{
                        }],
                        animationDurationUpdate: 1500,
                        animationEasingUpdate: 'quinticInOut',
                        series: [
                            {
                                type: 'graph',
                                layout: 'none',
                                roam: true,
                                label: {
                                    show: false
                                },
                                labelLayout: {
                                  hideOverlap: true
                                },
                                edgeSymbol: ['none', 'arrow'],
                                // edgeSymbolSize: [4, 10],
                                // edgeLabel: {
                                //     fontSize: 20
                                // },
                                // center: [0, 0],
                                // zoom: 1,
                                data: dataChild,
                                links: linksChild,
                                lineStyle: {
                                    opacity: 0.5,
                                    width: 2,
                                    curveness: 0,
                                },
                            }
                        ]
                    };
                    KnowledgeGraphChildChart.setOption(optionChild);
                }
            });
        });
    });
});
