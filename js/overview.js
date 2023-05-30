layui.use(['table', 'form'], function(){
    var table = layui.table
        , form = layui.form
        , $ = layui.$;

    var loadingLayer;
    new Promise(function (resolve, reject) {
        loadingLayer = layer.load(2, {
            shade: [0.5, '#fff'],
            time: 5 * 1000
        });
        table.render({
            elem: '#overviewPPV'
            , data: []
            , cols: [[ //表头
                { field: 'id', title: '序号', width: '20%' , align: 'center'}
                , { field: 'pointname', title: '测点名称', width: '20%', align: 'center'}
                , { field: 'time', title: '采集时间', width: '30%', align: 'center' }
                , { field: 'PPV', title: '峰峰值', width: '30%' , align: 'center'}
            ]]
        });
        resolve();
    }).then(function () {
        $(document).ready(function () {
            form.val("overviewTypeForm", { status: drawType});
            getEquipInfo();
            if ( drawType == "0"){
                startTimer(getPPVTableRealTime);
            }
            else{
                getPPVTable();
            }
        })
    }).then(function () {
        layer.close(loadingLayer)
    });

    function getPPVTableRealTime(){
        getPPVTable();
    }

    form.on('radio(overviewType)', function (data) {
        drawType = data.value;
        if (data.value == "0"){
            startTimer(getPPVTableRealTime);
        }
        else{
            clearTimer();
        }
    });
});

function getPPVTable(){
    let parameter = {}
    for (let i = 0; i < checkedList.length; i++) {
        parameter["MPIDList[" + i + "]"] = checkedList[i].mPID;
    }
    parameter["IndexNum"] = checkedTime;
    parameter["pageSize"] = 10;
    parameter["pageNum"] = 1;
    parameter["startTime"] = 1576753367;
    parameter["endTime"] = parseInt(new Date().getTime() / 1000);
    let urlRealTime = intervalId == 0?"":"_RealTime";
    layui.use(['table', 'form'], function(){
        var table = layui.table
            , form = layui.form
            , $ = layui.$;
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/rVibData/list" + urlRealTime,
            data: parameter,
            contentType: "application/x-www-form-urlencoded",
            // async: false,
            dataType: "json",
            success: function (data) {
                let l = data.data.list;
                let PPVTable = [];
                for (let i = 0; i < l.length; i++) {
                    let dataTimeItem = {};
                    dataTimeItem["id"] = l[i].mPID;
                    for (let j = 0; j < checkedList.length; j++) {
                        if (l[i].mPID == checkedList[j].mPID) {
                            dataTimeItem["pointname"] = checkedList[j].title;
                            break;
                        }
                    }
                    dataTimeItem["time"] = new Date(parseInt(l[i].indexNum) * 1000).toLocaleString().split('/').join('-');
            
                    dataTimeItem["PPV"] = l[i].pPV;
                    PPVTable.push(dataTimeItem);
                }
                table.reload('overviewPPV', { data: PPVTable });
            },
            error: function () {
                console.log("AJAX ERROR!")
            }
        })
    });
}

function getEquipInfo(){
    layui.use(['table'], function(){
        var table = layui.table
            , $ = layui.$;
        $.ajax({
            type: 'POST',
            url: "http://" + host + "/cms/mpparamsa/equipInfo",
            data: {},
            contentType: "application/x-www-form-urlencoded",
            // async: false,
            dataType: "json",
            success: function (res) {
                var data = res.data[0];
                document.getElementById("DBName").innerHTML = data.DBName;
                document.getElementById("EquipName").innerHTML = data.EquipName;
                document.getElementById("EquipType").innerHTML = data.EquipType;
                document.getElementById("FieldID").EquipName = data.FieldID;
                document.getElementById("Manufacturer").innerHTML = data.Manufacturer;
                document.getElementById("CollectorStatus").innerHTML = data.CollectorStatus;
            },
            error: function () {
                console.log("AJAX ERROR!")
            }
        })
    });
}