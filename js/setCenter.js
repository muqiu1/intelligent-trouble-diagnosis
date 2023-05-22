layui.use(['form', 'layer'], function () {
    var form = layui.form
        , layer = layui.layer;

    form.val("intervalTime-change", { intervalTime: intervalTime });

    form.verify({
        // 函数写法
        // 参数 value 为表单的值；参数 item 为表单的 DOM 对象
        myNumber: function (value, item) {
            if (!new RegExp("^[0-9]+$").test(value)) {
                return '请输入大于1的整数';
            }
            var num = parseInt(value);
            if (num < 1 ) {
                return '请输入大于1的整数';
            }
        },
    });

    // 监听提交
    form.on('submit(intervalTime-submit)', function (data) {
        intervalTime = parseInt(data.field.intervalTime);
        layer.msg('设置成功');
        return false;
    });
})