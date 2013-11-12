/**
*房态大日历控件v1.3
*@eDitor zzx
*@rewrite szwu@ctrip.com 2013-11-7
*@require lunarFestival.js
*/
; (function ($) {
    //require window.lunarFestival
    var cls = {
        name: 'fullCalendar',
        version: '1.3',
        init: function () { },
        uninit: function () { },
        module: fullCalendar
    };
    function fullCalendar(obj, opt) {
        //默认设置
        var defaults = {
            "festival": {
                "tbody": "今天",
                "tomorrow": "明天",
                "dopodomani": "后天"
            }
        };
        opt = $.extend(true, defaults, opt || {});
        this._init(obj, opt);
    }

    $.extend(fullCalendar.prototype, {
        _init: function (obj, opts) {
            this._opts = opts || {};
            var self = this,
                url,
                localData;
            this.box = $(obj);
            function updateView(_ret) {
                try {
                    if($.type(_ret) == 'string') {
                        _ret = $.parseJSON(_ret);
                    }
                    if ($.type(_ret) != "object") {
                        $.log("房态信息不是JSON格式，日历已终止运行！");
                        return;
                    }
                } catch (e) {
                    $.log("房态数据不是JSON格式，日历已终止运行！");
                    return;
                }
                self._opts = $.extend(true, self._opts, _ret);

                this.StartDate = this._opts.start || new Date().toFormatString('yyyy-MM-dd');
                this.StartYear = parseInt(this.StartDate.split("-")[0], 10);
                this.StartMonth = parseInt(this.StartDate.split("-")[1], 10);

                this.EndDate = this._opts.end || new Date().addYears(1).toFormatString('yyyy-MM-dd');
                this.EndYear = parseInt(this.EndDate.split("-")[0], 10);
                this.EndMonth = parseInt(this.EndDate.split("-")[1], 10);

                this.Year = this.StartYear;
                this.Month = this.StartMonth;
                this.newData = this._createNewData(this._opts.dates);
                this.drawRoomStatus(this.newData);//绘制房态日历
            }
            this.loading = this._opts.loading;
            url = this._opts.roomData.ajaxUrl;
            localData = this._opts.roomData.localData;
            if (localData) {
                updateView.call(this, localData);
                this.bindEvent();
            } else if(url){
                updateView.call(this,'{}');//绘制空日历
                this._loadData({
                    url: url,
                    "onsuccess": function (xhr, ret) {
                        updateView.call(self, ret);
                        self.bindEvent();
                        if (self._opts.onsuccess && typeof self._opts.onsuccess === "function") {
                            self._opts.onsuccess(_ret);
                        }
                    },
                    "onerror": function () {
                        $.log("数据加载错误!");
                    }
                });
            } else {
                $.log("没有房态数据");
            }
        },
        /*
        *处理后台返回的数据，返回含type=2和type=3的新对象
        *origin: [{date: "2013-11-10", type: 2, value: "不适用"}] type定义 1-满房;2-不适用; 3-有房
        *deal: 返回含type=2和type=3的新对象 {"2013-11-10": {type: 2, text: 不可用}}
        */
        _createNewData: function (dates) {
            var returnData = {};
            if(!dates) {
                return {};
            }
            for (var i = 0; i < dates.length; i++) {
                var datesI = dates[i];
                var dateArr = datesI.date.split("-");
                var key,
                    type,
                    text;
                key = parseInt(dateArr[0], 10) + "-" + parseInt(dateArr[1], 10) + "-" + parseInt(dateArr[2], 10);

                type = datesI.type || '3'; //1-满房;2-不适用; 3-有房
                text = this._opts.text[type];
                returnData[key] = {
                    type: type,
                    text: text
                }
            }
            return returnData;
        },
        _loadData: function (opts) {
            var self = this;
            var defaults = {
                url: "",
                "onsuccess": function () { },
                "onerror": function () { }
            };
            var opts = $.extend(defaults, opts);
            self.loading && self.loading.show();
            $.ajax(opts.url, {
                "onsuccess": function (xhr, ret) {
                    self.loading && self.loading.hide();
					self.box[0].style.display = "";
                    opts.onsuccess(xhr, ret)
                },
                "onerror": function (xhr) {
                    opts.onerror(xhr)
                }
            });
            //TODO
            //opts.onsuccess(undefined, '{start:"2013-11-1",end:"2013-12-31",dates:[]}');
            //opts.onsuccess(undefined, '{"start":"2013-11-1","end":"2014-2-28","dates":[{"date":"2013-11-10","value":"不适用","type":2},{"date":"2013-11-11","value":"不适用","type":2},{"date":"2013-11-12","value":"不适用","type":2},{"date":"2013-11-13","value":"不适用","type":2},{"date":"2013-11-14","value":"不适用","type":2},{"date":"2013-11-17","value":"不适用","type":2},{"date":"2013-11-18","value":"不适用","type":2},{"date":"2013-11-19","value":"不适用","type":2},{"date":"2013-11-20","value":"不适用","type":2},{"date":"2013-11-21","value":"不适用","type":2},{"date":"2013-11-24","value":"不适用","type":2},{"date":"2013-11-25","value":"不适用","type":2},{"date":"2013-11-26","value":"不适用","type":2},{"date":"2013-11-27","value":"不适用","type":2},{"date":"2013-11-28","value":"不适用","type":2},{"date":"2013-11-3","value":"不适用","type":2},{"date":"2013-11-4","value":"不适用","type":2},{"date":"2013-11-5","value":"不适用","type":2},{"date":"2013-11-6","value":"不适用","type":2},{"date":"2013-11-7","value":"不适用","type":2},{"date":"2013-12-1","value":"不适用","type":2},{"date":"2013-12-10","value":"不适用","type":2},{"date":"2013-12-11","value":"不适用","type":2},{"date":"2013-12-12","value":"不适用","type":2},{"date":"2013-12-15","value":"不适用","type":2},{"date":"2013-12-16","value":"不适用","type":2},{"date":"2013-12-17","value":"不适用","type":2},{"date":"2013-12-18","value":"不适用","type":2},{"date":"2013-12-19","value":"不适用","type":2},{"date":"2013-12-2","value":"不适用","type":2},{"date":"2013-12-22","value":"不适用","type":2},{"date":"2013-12-23","value":"不适用","type":2},{"date":"2013-12-24","value":"不适用","type":2},{"date":"2013-12-25","value":"不适用","type":2},{"date":"2013-12-26","value":"不适用","type":2},{"date":"2013-12-29","value":"不适用","type":2},{"date":"2013-12-3","value":"不适用","type":2},{"date":"2013-12-30","value":"不适用","type":2},{"date":"2013-12-31","value":"不适用","type":2},{"date":"2013-12-4","value":"不适用","type":2},{"date":"2013-12-5","value":"不适用","type":2},{"date":"2013-12-8","value":"不适用","type":2},{"date":"2013-12-9","value":"不适用","type":2},{"date":"2014-1-1","value":"不适用","type":2},{"date":"2014-1-12","value":"不适用","type":2},{"date":"2014-1-13","value":"不适用","type":2},{"date":"2014-1-14","value":"不适用","type":2},{"date":"2014-1-15","value":"不适用","type":2},{"date":"2014-1-16","value":"不适用","type":2},{"date":"2014-1-19","value":"不适用","type":2},{"date":"2014-1-2","value":"不适用","type":2},{"date":"2014-1-20","value":"不适用","type":2},{"date":"2014-1-21","value":"不适用","type":2},{"date":"2014-1-22","value":"不适用","type":2},{"date":"2014-1-23","value":"不适用","type":2},{"date":"2014-1-26","value":"不适用","type":2},{"date":"2014-1-27","value":"不适用","type":2},{"date":"2014-1-28","value":"不适用","type":2},{"date":"2014-1-29","value":"不适用","type":2},{"date":"2014-1-30","value":"不适用","type":2},{"date":"2014-1-5","value":"不适用","type":2},{"date":"2014-1-6","value":"不适用","type":2},{"date":"2014-1-7","value":"不适用","type":2},{"date":"2014-1-8","value":"不适用","type":2},{"date":"2014-1-9","value":"不适用","type":2},{"date":"2014-2-10","value":"不适用","type":2},{"date":"2014-2-11","value":"不适用","type":2},{"date":"2014-2-12","value":"不适用","type":2},{"date":"2014-2-13","value":"不适用","type":2},{"date":"2014-2-16","value":"不适用","type":2},{"date":"2014-2-17","value":"不适用","type":2},{"date":"2014-2-18","value":"不适用","type":2},{"date":"2014-2-19","value":"不适用","type":2},{"date":"2014-2-2","value":"不适用","type":2},{"date":"2014-2-20","value":"不适用","type":2},{"date":"2014-2-23","value":"不适用","type":2},{"date":"2014-2-24","value":"不适用","type":2},{"date":"2014-2-25","value":"不适用","type":2},{"date":"2014-2-26","value":"不适用","type":2},{"date":"2014-2-27","value":"不适用","type":2},{"date":"2014-2-3","value":"不适用","type":2},{"date":"2014-2-4","value":"不适用","type":2},{"date":"2014-2-5","value":"不适用","type":2},{"date":"2014-2-6","value":"不适用","type":2},{"date":"2014-2-9","value":"不适用","type":2}]}');
        },
        _diffDate: function (date1, date2) {
            return date1.toDate().valueOf() - date2.toDate().valueOf();
        },
        _createRoomStatu: function (data) {
            data = data || {};
            var self = this,
                opts = self._opts,
                roomStatuArr = [],//用来保存日期列表 
                year = this.Year,
                month = this.Month,//实际月份
                firstDay = new Date(year, month - 1, 1).getDay(),//本月第一天星期几, month 为 实际月份
                nextMonthFirstDay = new Date(year, month, 1).getDay(),//下月第一天星期几
                isDisplayRoomInfo = opts.isDisplay || false,
                isShowFestival = opts.isShowFestival;
            function setTypeAndText (roomObj) {
                //按默认有房的规则填充数据
                roomObj.type = isDisplayRoomInfo ? (state ? state.type : 3) : undefined; //1-满房;2-不适用; 3-有房
                roomObj.text = isDisplayRoomInfo ? opts.text[roomObj.type]: '';
            }
            function setFestival (roomObj, year, month, day) {
                var recentDays = lunarFestival.getRecentDays(year, month, day);
                if(isShowFestival) {
                    roomObj.festival = lunarFestival.getFestival(year, month, day);
                }else {
                    switch(recentDays) {
                        case '今天':
                            recentDays = self._opts.festival['today'];
                            break;
                        case '明天':
                            recentDays = self._opts.festival['tomorrow'];
                            break;
                        case '后天':
                            recentDays = self._opts.festival['dopodomani'];
                            break;
                        defaults:;
                    }
                    roomObj.festival = recentDays;
                }
            }
            //补充上月日历最后几天
            //firstDay == 0 && (firstDay += 7);
            for (var i = 1 - firstDay; i < 1; i++) {//i为当天与本月第一天的差值，负值
                var roomObj = {};
                var lastMonthI = new Date(year, month - 1, i).getDate();//当天日期值
                var thatDate = year + "-" + (month - 1) + "-" + lastMonthI;
                var state = data[thatDate];
                setFestival(roomObj, year, month - 2, i);
                roomObj.date = lastMonthI;
                setTypeAndText(roomObj);
                roomObj.whichMonth = 'lastMonth';
                roomStatuArr.push(roomObj);
            }
            //当月日历
            for (var i = 1, monthDay = new Date(year, month, 0).getDate(); i <= monthDay; i++) {
                var roomObj = {};
                var thatDate = year + "-" + month + "-" + i;
                var state = data[thatDate];
                setFestival(roomObj, year, month - 1, i);
                roomObj.date = i;
                setTypeAndText(roomObj);
                roomObj.whichMonth = 'currentMonth';
                roomStatuArr.push(roomObj);
            }
            //补齐下月日历前几天
            nextMonthFirstDay == 0 && (nextMonthFirstDay += 7);
            for (var i = nextMonthFirstDay, j = 1; i < 7; i++, j++) {//i为当天与下第一天的星期几，j为下月当天日期值
                var roomObj = {};
                var thatDate = year + "-" + (month + 1) + "-" + j;
                var state = data[thatDate];
                setFestival(roomObj, year, month, i);
                roomObj.date = j;
                setTypeAndText(roomObj);

                roomObj.whichMonth = 'nextMonth';
                roomStatuArr.push(roomObj);
            }

            return roomStatuArr;
        },
        drawRoomStatus: function (data) {
            var self = this,
                roomStatuArr = this._createRoomStatu(data),
                opts = this._opts;
            var html = $._tmpl(opts.tpl, {
                data: {
                    roomInfo: roomStatuArr,
                    year: self.Year,
                    month: self.Month,
                    prevBtnCls: self._getDisable('上月'),
                    nextBtnCls: self._getDisable('下月')
                }
            });
            this.box.html(html);
            this.prevBtn = self.box.find(self._opts.prevBtn),
            this.nextBtn = self.box.find(self._opts.nextBtn);
        },
        _prevAndNextBtnHandle: function (e) {
            var self = this,
                target = e.target || e.srcElement,
                cls = target.className;
            if (cls == self._opts.cls.prevDisable || cls == self._opts.cls.nextDisable) {
                return;
            } else if(target.title == '上月'){
                self._drawPrevMonth();
            } else if(target.title == '下月'){
                self._drawNextMonth();
            }
        },
        bindEvent: function () {
            var self = this;
            self.box.bind("click", function(e) {
                self._prevAndNextBtnHandle.call(self, e);
            });
        },
        _compareDate: function (date1, date2) {
            function clearTime (date) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date;
            };
            clearTime(date1);
            clearTime(date2);
            if (isNaN(date1) || isNaN(date2)) {
                throw new Error(date1 + " - " + date2);
            } else if (date1 instanceof Date && date2 instanceof Date) {
                return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
            } else {
                throw new TypeError(date1 + " - " + date2);
            }
        },
        _getDisable: function (title) {
            if (title == "上月") {
                var date1 = new Date(this.StartYear, this.StartMonth - 1);
                var date2 = new Date(this.Year, this.Month - 1); ;
                var isSame = this._compareDate(date1, date2);
                if (isSame < 0) {
                    return this._opts.cls.prevEnable;
                } else {
                    return this._opts.cls.prevDisable;
                }
            } else if (title == "下月") {
                var date1 = new Date(this.EndYear, this.EndMonth - 1);
                var date2 = new Date(this.Year, this.Month - 1); ;
                var isSame = this._compareDate(date1, date2);
                if (isSame > 0) {
                    return  this._opts.cls.nextEnable;
                } else {
                    return  this._opts.cls.nextDisable;
                }
            }
        },
        //上一个月 
        _drawPrevMonth: function () {
            //先取得上一个月的日期对象 
            var d = new Date(this.Year, this.Month - 2, 1);
            //再设置属性 
            this.Year = d.getFullYear();
            this.Month = d.getMonth() + 1;
            //重新画日历 
            this.drawRoomStatus(this.newData);
        },
        //下一个月 
        _drawNextMonth: function () {
            var d = new Date(this.Year, this.Month, 1);
            this.Year = d.getFullYear();
            this.Month = d.getMonth() + 1;
            this.drawRoomStatus(this.newData);
        }
    });
    $.mod.reg(cls);
    $.fullCalendar = fullCalendar;
})(cQuery);
