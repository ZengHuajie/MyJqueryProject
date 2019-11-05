(function ($) {

    // 创建构造函数TurnPage
    function TurnPage(options) {
        this.wrap = options.wrap;
        this.allPageSize = options.allPageSize;
        this.pageSize = options.pageSize;
        this.nowPage = options.nowPage;
        //页数 = 总数 / 每页的条数
        this.allPage = Math.ceil(this.allPageSize / this.pageSize);
        if(this.nowPage > this.allPage) {
            alert('页码输入错误！');
            return false;
        }
        // 告知用户，当前页码和条数
        this.changePageCb = options.changePageCb;
        this.createDom();
        this.bindEvent();
    }
    // 在原型链上扩展创建的方法
    TurnPage.prototype.createDom = function () {
        $(this.wrap).empty();
        var oDiv = $('<div class="page-size"><span>每页条数</span></div>');
        var oInput = $('<input class="size" type="number" min="1" max="50" value="' + this.pageSize +'" ></input');
        var oUl = $('<ul class="my-turn-page"></ul>');
        oDiv.append(oInput).appendTo(this.wrap);
        // 渲染上一页
        if(this.nowPage > 1) {
            $('<li class="prev-page">上一页</li>').appendTo(oUl);
        }
        // 单独渲染第一页
        if(this.nowPage > 3) {
            $('<li class="num">1</li>').appendTo(oUl);
        }
        // 渲染第一个省略号
        if(this.nowPage > 4) {
            $('<span>...</span>').appendTo(oUl);
        }
        //渲染中间五页  范围：当前页-2到当前页+2
        for(var i = this.nowPage - 2; i <= this.nowPage + 2; i ++) {
            if(i == this.nowPage) {
                $('<li class="num active">' + i + '</li>').appendTo(oUl);
            }else if(i > 0 && i < this.allPage) {
                $('<li class="num">' + i + '</li>').appendTo(oUl);
            }
        }
        // 渲染后面省略号
        if(this.nowPage < this.allPage - 3) {
            $('<span>...</span>').appendTo(oUl);
        }
        // 单独渲染最后一页
        if(this.nowPage < this.allPage) {
            $('<li class="num">' + this.allPage + '</li>').appendTo(oUl);
        }
        // 渲染下一页
        if(this.nowPage < this.allPage) {
            $('<li class="next-page">下一页</li>').appendTo(oUl);
        }

        $(this.wrap).append(oUl);
    }

    TurnPage.prototype.bindEvent = function () {
        var self = this;
        // 点击页码
        $('.num', this.wrap).click(function () {
            var page = parseInt($(this).text());
            // console.log(page);
            self.changePage(page);
        })
        // 点击上一页
        $('.prev-page', this.wrap).click(function () {
            if(self.nowPage > 1) {
                self.changePage(self.nowPage - 1);
            }
        })
        // 点击下一页
        $('.next-page', this.wrap).click(function () {
            if(self.nowPage < self.allPage) {
                self.changePage(self.nowPage + 1);
            }
        })
        // 设置输入框的每页显示条数
        $('.size').change(function () {
            self.pageSize = parseInt($(this).val());
            // 每页的条数变了，总页数也会跟着改变
            self.allPage = Math.ceil(self.allPageSize / self.pageSize);
            self.changePage(1);
        })

    }

    TurnPage.prototype.changePage = function (page) {
        this.nowPage = page;
        this.createDom();
        this.bindEvent();
        // 如果用户传了回调函数，才执行
        this.changePageCb && this.changePageCb({
           nowPage: this.nowPage,
           pageSize: this.pageSize
        });
    }


    // 在原型链上扩展一个page方法
    $.fn.extend({
        page: function (options) {
            // 保存父级
            options.wrap = this;
            new TurnPage(options);
            return this;
        }
    })

}(jQuery))