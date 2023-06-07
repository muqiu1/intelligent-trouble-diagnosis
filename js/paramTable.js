initName()
let parameter = {}
let paramTable = {};
// let paramTime = [];
let paramFreq = [];
layui.use(['table', 'form'], function () {
    var table = layui.table
        , form = layui.form
        , $ = layui.$
    new Promise(function (resolve, reject) {
        for (let i = 0; i < checkedList.length; i++) {
            parameter["MPIDList[" + i + "]"] = checkedList[i].mPID;
        }
        parameter["IndexNum"] = checkedTime;
        parameter["pageSize"] = 50;
        parameter["pageNum"] = 1;
        parameter["startTime"] = 1576753367;
        // table.render({
        //     elem: '#paramTable1'
        //     , data: []
        //     , limit: parameter.pageSize
        //     , even: true
        //     , cols: [[ //表头
        //         { field: 'id', title: '序号', width: '5%', fixed: 'left' }
        //         , { field: 'pointname', title: '测点名称', width: '16%', }
        //         , { field: 'time', title: '采集时间', width: '15%' }
        //         , { field: 'PPV', title: '峰峰值', width: '8%' }
        //         , { field: 'FZYZ', title: '峰值因子', width: '8%' }
        //         , { field: 'PDYZ', title: '偏度因子', width: '8%', }
        //         , { field: 'QDYZ', title: '峭度因子', width: '8%', }
        //         , { field: 'YDYZ', title: '裕度因子', width: '8%', }
        //         , { field: 'MCYZ', title: '脉冲因子', width: '8%' }
        //         , { field: 'BXYZ', title: '波形因子', width: '8%' }
        //         , { field: 'Gap', title: '间隙', width: '8%' }
        //     ]]
        // });
        table.render({
            elem: '#paramTable2'
            , data: []
            , limit: parameter.pageSize
            , even: true
            , cols: [[ //表头
                { field: 'id', title: '序号', width: '5%', fixed: 'left' }
                , { field: 'pointname', title: '测点名称', width: '13%', }
                , { field: 'time', title: '采集时间', width: '12%' }
                , { field: 'PPV', title: '峰峰值', width: '9%' }
                , { field: 'Gap', title: '间隙', width: '8%' }
                , { field: 'halfMag', title: '0.5倍频幅值', width: '8%' }
                , { field: 'halfP', title: '0.5倍频相位', width: '8%' }
                , { field: 'x1Mag', title: '1倍频幅值', width: '7%' }
                , { field: 'x1P', title: '1倍频相位', width: '7%' }
                , { field: 'x2Mag', title: '2倍频幅值', width: '7%' }
                , { field: 'x2P', title: '2倍频相位', width: '7%' }
                , { field: 'x3Mag', title: '3倍频幅值', width: '7%' }
                , { field: 'x3P', title: '3倍频相位', width: '7%' }
                , { field: 'x4Mag', title: '4倍频幅值', width: '7%' }
                , { field: 'x5Mag', title: '5倍频幅值', width: '7%' }
            ]]
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("paramTableTypeForm", { status: drawType});
            if ( drawType == "0"){
                startTimer(getParamTable);
            }
            else{
                if ( checkedTime == 0 || checkedTime == null ){
                    layer.alert('请先在左侧选择查询时间戳', {
                        icon: 0,
                        shadeClose: true,
                        title: "提示",
                    })
                }
                else {
                    getParamTable();
                }
            }
        })
    });

    function getParamTable() {
        new Promise(function (resolve, reject) {
            getParam();
            resolve();
        }).then(function () {
            parseData();
        }).then(function () {
            // table.reload('paramTable1', { data: paramTime }, true);
            table.reload('paramTable2', { data: paramFreq }, true);
        });
    }

    form.on('radio(paramTableType)', function (data) {
        drawType = data.value;
        if (data.value == "0") {
            startTimer(getParamTable);
        }
        else {
            clearTimer();
        }
    });
});

function getParam() {
    parameter["endTime"] = parseInt(new Date().getTime() / 1000);
    let urlRealTime = intervalId == 0?"":"_RealTime";
    layui.$.ajax({
        type: 'POST',
        url: "http://" + host + "/cms/rVibData/list" + urlRealTime,
        data: parameter,
        contentType: "application/x-www-form-urlencoded",
        async: false,
        dataType: "json",
        success: function (data) {
            paramTable = data;
        },
        error: function () {
            console.log("AJAX ERROR!")
        }
    })
}

function parseData() {
    let l = paramTable.data.list;
    // paramTime = [];
    paramFreq = [];
    for (let i = 0; i < l.length; i++) {
        // let dataTimeItem = {};
        let dataFreqItem = {};
        // dataTimeItem["id"] = l[i].mPID;
        dataFreqItem["id"] = l[i].mPID;
        for (let j = 0; j < checkedList.length; j++) {
            if (l[i].mPID == checkedList[j].mPID) {
                // dataTimeItem["pointname"] = checkedList[j].title;
                dataFreqItem["pointname"] = checkedList[j].title;
                break;
            }
        }
        // dataTimeItem["time"] = new Date(parseInt(l[i].indexNum) * 1000).toLocaleString().split('/').join('-');
        dataFreqItem["time"] = new Date(parseInt(l[i].indexNum) * 1000).toLocaleString().split('/').join('-');

        // dataTimeItem["PPV"] = l[i].pPV;
        // dataTimeItem["FZYZ"] = l[i].fZYZ;
        // dataTimeItem["PDYZ"] = l[i].pDYZ;
        // dataTimeItem["QDYZ"] = l[i].qDYZ;
        // dataTimeItem["YDYZ"] = l[i].yDYZ;
        // dataTimeItem["MCYZ"] = l[i].mCYZ;
        // dataTimeItem["BXYZ"] = l[i].bXYZ;
        // dataTimeItem["Gap"] = l[i].gap;

        dataFreqItem['halfMag'] = l[i].halfMag;
        dataFreqItem['halfP'] = l[i].halfP;
        dataFreqItem['x1Mag'] = l[i].x1Mag;
        dataFreqItem['x1P'] = l[i].x1P;
        dataFreqItem['x2Mag'] = l[i].x2Mag;
        dataFreqItem['x2P'] = l[i].x2P;
        dataFreqItem['x3Mag'] = l[i].x3Mag;
        dataFreqItem['x3P'] = l[i].x3P;
        dataFreqItem['x4Mag'] = l[i].x4Mag;
        dataFreqItem['x5Mag'] = l[i].x5Mag;

        dataFreqItem["PPV"] = l[i].pPV;
        dataFreqItem["Gap"] = l[i].gap;

        // paramTime.push(dataTimeItem);
        paramFreq.push(dataFreqItem);
    }
}