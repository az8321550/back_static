# back_static
page is in gihub
#nice back create by nobody

数据表格：jqgrid

参考页面:list.html

html

    <table id="data" class="ui-jqgrid"></table>
    <div id="pager"></div>

js->

    $("#data").jqGrid({
    url: 'test.php',
    colNames: ['活动ID', '活动名称', '状态', '目标人数', '实际发送量', '执行时间', '开始日期', '结束日期', '创建部门', '创建人'],
    colModel: [
        { name: "id", sortable: true, width: 60, formatter: formatId },
        { name: "name", sortable: true },
        { name: "name2" },
        { name: "name3" },
        { name: "name4" },
        { name: "num" },
        { name: "name5" },
        { name: "name6" },
        { name: "name7" },
        { name: "name8" }
    ]
    });

###增删查改

参考页面：setting.html

双击数据列可弹出修改弹窗

点击新建按钮可以弹出新建弹窗

###alret框

控件bootstrap-bootbox

插件文档：[http://bootboxjs.com/](http://bootboxjs.com/)

    bootbox.alert("alert内容")