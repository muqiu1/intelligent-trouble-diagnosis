layui.use(['util'], function () {
    var $ = layui.$
    //     , util = layui.util
    //     , layer = layui.layer;

    // util.fixbar({
    //     bar2: true,
    //     click: function(type){
    //         if(type === 'bar2'){
    //             layer.open({
    //                 type: 1,
    //                 area: ['420px', '240px'], // 宽高
    //                 content: '<div style="padding: 11px;">任意 HTML 内容</div>'
    //             });
    //         }
    //     }
    // });
        
    var characterList = [];
    var faultList = [];
    var ruleList = [];
    var measureList = [];
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
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/measure/list",
            data: {},
            contentType: "application/x-www-form-urlencoded",
            async: false,
            dataType: "json",
            success: function (res) {
                let data = res.data;
                measureList = data.data;
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
                symbolSize: [20, 20],
                label: {
                    show: true,
                    // fontSize: 15,
                    formatter: '{c}',
                    position: 'bottom'
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
                symbol: 'circle',
                symbolSize: [30, 30],
                label: {
                    show: true,
                    // fontSize: 15,
                    formatter: '{c}',
                    position: 'bottom'
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
        for (var i = 0; i < measureList.length; i++) {
            data.push({
                name: '维修策略' + measureList[i].MeasureID,
                y: x_min + (x_max - x_min) * i / (measureList.length - 1),
                x: 3000,
                value: measureList[i].Measures,
                symbol: 'circle',
                symbolSize: [30, 30],
                label: {
                    show: true,
                    // fontSize: 15,
                    formatter: '{c}',
                    position: 'bottom'
                },
                itemStyle: {
                    color: colorTable[ measureList[i].FaultID ],
                }
            })
            links.push({
                source: '故障' + measureList[i].FaultID,
                target: '维修策略' + measureList[i].MeasureID,
                label: {
                    show: false
                },
                lineStyle: {
                    color: colorTable[ measureList[i].FaultID ],
                }
            })
        }
        option = {
            title: {
                text: '知识可视化'
            },
            textStyle: {
                fontSize: 20
            },
            tooltip: {},
            toolbox: {
                show: true,
                feature: {
                    restore: {},
                    saveAsImage: {
                        name: new Date().toLocaleString('chinese',{hour12: false}).split('/').join('-'),
                    }
                }
            },
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
                    zoom: 1.2,
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
                                        target: params.name,
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
                                        symbolSize: [35, 35],
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
                        var x_max = ifList.length > 1 ? x_min + d * (ifList.length - 1) : d;
                        dataChild.push({
                            name: params.name,
                            y: (x_max + x_min) / 2,
                            x: (x_max + x_min) / 2,
                            value: params.value,
                            symbol: 'circle',
                            symbolSize: [48, 48],
                            label: {
                                show: true,
                                fontSize: 15,
                                formatter: '{c}'
                            },
                            itemStyle: {
                                color: params.color,
                            }
                        })
                        var cnt = 0, j = 0;
                        for (var i = 0; i < measureList.length; i++) {
                            if (measureList[i].FaultID == params.name.slice(2)) {
                                cnt ++ ;
                            }
                        }
                        for (var i = 0; i < measureList.length; i++) {
                            if (measureList[i].FaultID == params.name.slice(2)) {
                                dataChild.push({
                                    name: '维修策略' + measureList[i].MeasureID,
                                    y: cnt == 1 ? (x_max + x_min) / 2 : x_min + (x_max - x_min) * j / (cnt - 1),
                                    x: x_max + x_min,
                                    value: measureList[i].Measures,
                                    symbol: 'circle',
                                    symbolSize: [48, 48],
                                    label: {
                                        show: true,
                                        fontSize: 15,
                                        formatter: '{c}'
                                    },
                                    itemStyle: {
                                        color: params.color,
                                    }
                                })
                                linksChild.push({
                                    source: params.name,
                                    target: '维修策略' + measureList[i].MeasureID,
                                    label: {
                                        show: false
                                    },
                                    lineStyle: {
                                        color: params.color,
                                    }
                                })
                                j ++ ;
                            }
                        }
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
                        var x_max = FaultIDList.length > 1 ? x_min + d * (FaultIDList.length - 1) : d;
                        dataChild.push({
                            name: params.name,
                            y: (x_max + x_min) / 2,
                            x: 0,
                            value: params.value,
                            symbol: 'circle',
                            symbolSize: [35, 35],
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
                                        y: FaultIDList.length > 1 ? x_min + d * i : (x_max + x_min) / 2,
                                        x: (x_max + x_min) / 2,
                                        value: faultList[j].FaultName,
                                        symbol: 'circle',
                                        symbolSize: [48, 48],
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
                    else if (params.name.slice(0, 2) == '维修'){
                        let FaultID = '';
                        let MeasureID = parseInt(params.name.slice(4));
                        var x_max = d;
                        for (var i = 0; i < measureList.length; i++) {
                            if (measureList[i].MeasureID == MeasureID) {
                                FaultID = measureList[i].FaultID;
                                dataChild.push({
                                    name: params.name,
                                    y: 0,
                                    x: x_max + x_min,
                                    value: measureList[i].Measures,
                                    symbol: 'circle',
                                    symbolSize: [48, 48],
                                    label: {
                                        show: true,
                                        fontSize: 15,
                                        formatter: '{c}'
                                    },
                                    itemStyle: {
                                        color: params.color,
                                    }
                                })
                                linksChild.push({
                                    source: params.name,
                                    target: '故障' + FaultID,
                                    label: {
                                        show: false
                                    },
                                    lineStyle: {
                                        color: params.color,
                                    }
                                })
                                break;
                            }
                        }
                        for (var i = 0; i < faultList.length; i++) {
                            if (faultList[i].FaultID == FaultID) {
                                dataChild.push({
                                    name: '故障' + FaultID,
                                    y: 0,
                                    x: (x_max + x_min)/2,
                                    value: faultList[i].FaultName,
                                    symbol: 'circle',
                                    symbolSize: [48, 48],
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

                    var optionChild = {
                        tooltip: {},
                        legend: [{
                        }],
                        toolbox: {
                            show: true,
                            feature: {
                                restore: {},
                                saveAsImage: {
                                    name: new Date().toLocaleString('chinese',{hour12: false}).split('/').join('-'),
                                }
                            }
                        },
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
