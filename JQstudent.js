var nowPage = 1,
    pageSize = 14,
    allPageSize = 0;
//回填的表单数据用作全局变量
var tableData = [];
var flag = false;
// 绑定事件
function bindEvent() {
    // 左侧菜单栏的切换
    $('.menu-list').on('click', 'dd', function () {
        //删除兄弟节点的active
        $(this).siblings().removeClass('active');
        //给被选中的添加
        $(this).addClass('active');
        var id = $(this).data('id');
        // console.log(id);
        if (id == 'student-list') {
            getTableData();
        }
        $('.content').fadeOut();
        $('#' + id).fadeIn();
    })
    // 点击新增学生提交按钮
    $('#add-student-btn').click(function (e) {
        // 阻止form表单提交后的默认刷新页面
        e.preventDefault();
        if(flag) {
            return false;
        }
        flag = true;
        //将表单以数组的形式返回(会有对应的name和value)
        var data = $('#add-student-form').serializeArray();
        //将返回的数组处理成对象
        data = formatObj(data);
        formatObj(data);
        console.log(data);
        transferData('/api/student/addStudent', data, function (res) {
            //添加成功后，重置表单
            // alert('已添加成功');
            $('#add-student-form')[0].reset();
            $('.list').trigger('click');
            flag = false;
        })
    });

    // 点击学生列表的编辑按钮  通过冒泡，冒泡到edit按钮
    $('#tbody').on('click', '.edit', function (e) {
        var index = $(this).data('index');
        renderForm(tableData[index]);
        // console.log(index);
        $('.dialog').slideDown();
    });
    $('.mask').click(function () {
        $('.dialog').slideUp();
    })
    // 点击编辑里的提交按钮
    $('#edit-student-btn').click(function (e) {
        // 阻止form表单提交后的默认刷新页面
        e.preventDefault();
        if(flag) {
            return false;
        }
        flag = true;
        //将表单以数组的形式返回(会有对应的name和value)
        var data = $('#edit-student-form').serializeArray();
        //将返回的数组处理成对象
        data = formatObj(data);
        formatObj(data);
        console.log(data);
        transferData('/api/student/updateStudent', data, function (res) {
            alert('已编辑成功');
            $('#edit-student-form')[0].reset();

            var val = $('#search-word').val();
            // console.log(val);
            if(val) {
                // 如果搜索框内有值，就搜索关键字
                filterData(val);
            }else {
                getTableData(tableData);
            }
            $('.mask').trigger('click');
            flag = false;
        })
    });

    // 点击学生列表的删除按钮
    $('#tbody').on('click', '.del', function (e) {
        var index = $(this).data('index');
        // console.log(tableData[index]);
        var isDel = window.confirm('确认删除？');
        if(isDel) {
            transferData('/api/student/delBySno', {
                sNo: tableData[index].sNo
            }, function (res) {
                // 删除完之后，列表数据需要重新获取一遍。
                alert('已删除成功');
                $('.list').trigger('click');
            })
        }
    });

    // 点击搜索按钮
    $('#search-submit').click(function (e) {
        var val = $('#search-word').val();
        // console.log(val);
        if(val) {
            // 如果搜索框内有值，就搜索关键字
            filterData(val);
        }else {
            getTableData(tableData);
        }
    })

}



function autoAdd() {
    getName();
    getSex();
    getSex();
    getNumber();
    getEmail();
    getBirth();
    getTel();
    getAddress();
}

// 随机生成姓名
function getName() {
    var familyNames = new Array(
        "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
        "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
        "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
        "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
        "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
        "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
        "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
        "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
        "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
    );
    var givenNames = new Array(
        "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
        "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
        "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
        "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
        "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
        "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
        "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
        "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
        "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
        "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
    );
    var i = parseInt(Math.random() * 100);
    var familyName = familyNames[i];
    var j = parseInt(Math.random() * 100);
    var givenName = givenNames[j];
    var name = familyName + givenName;
    $('#add-name').val(name);
}

// 随机生成男女
function getSex() {
    parseInt(Math.random() * 10) % 2 ? $('#add-male').click() : $('#add-female').click();
}

// 随机输入学号
function getNumber() {
    var num = parseInt(Math.random() * 100000);
    $('#add-sNo').val(num);
}

//随机生成邮箱
function getEmail() {
    var num = num = parseInt(Math.random() * 100000000),
        email = num + '@qq.com';
    $('#add-email').val(email);
}

// 随机生成出生年
function getBirth() {
    var num = parseInt(Math.random() * 20 + 1980 + 1);
    $('#add-birth').val(num);
}

// 随机生成手机号
function getTel() {
    var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
    var i = parseInt(10 * Math.random());
    var prefix = prefixArray[i];
    for (var j = 0; j < 8; j++) {
        prefix = prefix + Math.floor(Math.random() * 10);
    }
    $('#add-phone').val(prefix);
}

// 随机生成住址
function getAddress() {
    parseInt(Math.random() * 10) % 2 ? $('#add-address').val('深圳') : $('#add-address').val('北京');
}




//获取数据(按页获取)
function getTableData() {
    transferData('/api/student/findByPage', {
        page: nowPage,
        size: pageSize
    }, function (res) {
        // console.log(res);
        allPageSize = res.data.cont;
        // 拿到数据
        tableData = res.data.findByPage;
        // 渲染数据
        renderTable(tableData);
    });
}

//渲染数据
function renderTable(data) {
    var str = '';
    data.forEach(function (item, index) {
        str += '<tr>\
            <td>' + item.sNo + '</td>\
            <td>' + item.name + '</td>\
            <td>' + (item.sex ? '女' : '男') + '</td>\
            <td>' + item.email + '</td>\
            <td>' + (new Date().getFullYear() - item.birth) + '</td>\
            <td>' + item.phone + '</td>\
            <td>' + item.address + '</td>\
            <td>\
                <button class="btn edit" data-index='+ index +'>编辑</button>\
                <button class="btn del" data-index='+ index +'>删除</button>\
            </td>\
        </tr>'
        $('#tbody').html(str);
        // 在获取数据的时候，渲染分页组件
        $('#turn-page').page({
            allPageSize: allPageSize,
            pageSize: pageSize,
            nowPage: nowPage,
            // 改变页码
            changePageCb: function (obj) {
                nowPage = obj.nowPage;
                pageSize = obj.pageSize;
                // 改变页码的时候，需要重新获取数据
                var val = $('#search-word').val();
                // console.log(val);
                if(val) {
                    // 如果搜索框内有值，就搜索关键字
                    filterData(val);
                }else {
                    getTableData(tableData);
                }
            }
        })
    })

}


//处理点击后返回的form表单的数据，以对象的形式返回
function formatObj(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].name]) {
            obj[arr[i].name] = arr[i].value;
        }
    }
    return obj;
}


//点击编辑后，回填表单数据
function renderForm(data) {
    var form = $('#edit-student-form')[0];
    for(var prop in data) {
        if(form[prop]) {
            form[prop].value = data[prop];
        }
    }
}

//搜索关键字
function filterData(val) {
    transferData('/api/student/searchStudent', {
        sex: -1,
        search: val,
        page: nowPage,
        size: pageSize
    }, function (res) {
        // 会返回一个cont→当前页面的信息条数
        allPageSize = res.data.cont;
        // 直接渲染符合搜索到的信息
        renderTable(res.data.searchList);
    })
}


//封装ajax
function transferData(url, data, cb) {
    $.ajax({
        type: 'get',
        url: 'http://api.duyiedu.com' + url,
        data: $.extend(data, {
            appkey: '13267121931_1554205022179',
        }),
        dataType: 'json',
        success: function (res) {
            if (res.status == 'success') {
                cb(res);
            } else {
                alert(res.msg);
            }
        }
    })
}

function init() {
    bindEvent();
    $('.list').trigger('click');
    // $('.add').trigger('click');
    // for(var i = 0; i < 100; i ++) {
    //     autoAdd();
    //     $('#add-student-btn').trigger('click');
    // }

}
init();

