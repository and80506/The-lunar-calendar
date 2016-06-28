/**
 *日历控件v1.3
 *@author szwu@ctrip.com 2013-11-7
 *@require lunarFestival.js
 */
; (function (win) {
  //require window.lunarFestival
  function fullCalendar(obj, opt) {
    //默认设置
    var defaults = {
      festival: {
        tbody: "今天",
        tomorrow: "明天",
        dopodomani: "后天"
      }
    };
    opt = $.extend(true, defaults, opt || {});
    this._init(obj, opt);
  }

  fullCalendar.prototype = {
    _init: function (obj, opts) {
      this._opts = opts || {};
      var self = this,
        url,
        localData;
      this.box = $(obj);
      function updateView(_ret) {
        var now = new Date();
        var nextYear;
        var month;
        var date;
        try {
          if( typeof _ret == 'string' ) {
            _ret = $.parseJSON(_ret);
          }
          if ( typeof _ret != "object") {
            console.warn("extraData is not valid JSON");
            return;
          }
        } catch (e) {
          console.warn("extraData is not valid JSON");
          return;
        }
        nextYear = now.getFullYear() + 1;
        month = now.getMonth();
        date = now.getDate();
        self._opts = $.extend(true, self._opts, _ret);

        this.StartDate = this._opts.start || this.date2Str(now, 'yyyy-MM-dd');
        this.StartYear = parseInt(this.StartDate.split("-")[0], 10);
        this.StartMonth = parseInt(this.StartDate.split("-")[1], 10);

        this.EndDate = this._opts.end || this.date2Str(new Date(nextYear, month, date), 'yyyy-MM-dd');
        this.EndYear = parseInt(this.EndDate.split("-")[0], 10);
        this.EndMonth = parseInt(this.EndDate.split("-")[1], 10);

        this.Year = this.StartYear;
        this.Month = this.StartMonth;
        this.render(this._opts.dates);
      }
      this.loading = this._opts.loading;
      url = this._opts.extraData.ajaxUrl;
      localData = this._opts.extraData.localData;
      if (localData) {
        updateView.call(this, localData);
        this.bindEvent();
      } else if(url){
        //updateView.call(this,'{}');//绘制空日历
        this._loadData({
          url: url,
          onsuccess: function (ret) {
            updateView.call(self, ret);
            self.bindEvent();
            if (self._opts.onsuccess && typeof self._opts.onsuccess === "function") {
              self._opts.onsuccess(_ret);
            }
          },
          onerror: function () {
            console.warn("load ajax data occur error!");
          }
        });
      }
    },
    //绘制带状态日历
    render: function (dates) {
      this.newData = this._createNewData(dates);
      this.drawExtraStatus(this.newData);
      var onRender = this._opts.onRender;
      if( typeof onRender == 'function' ) {
        onRender.call(this);
      }
    },
    /*
     *处理后台返回的数据，返回含type=2和type=3的新对象
     *origin: [{date: "2013-11-10", activityList: []}]
     *deal: 返回含type=2和type=3的新对象 {"2013-11-10": []}
     */
    _createNewData: function (dates) {
      var returnData = {};
      if(!dates) {
        return {};
      }
      for (var i = 0; i < dates.length; i++) {
        var datesI = dates[i];
        returnData[datesI.date] = {
          activityList: datesI.activityList
        }
      }
      return returnData;
    },
    _loadData: function (opts) {
      var self = this;
      var defaults = {
        url: "",
        success: function () { },
        error: function () { }
      };
      var opts = $.extend(defaults, opts);
      self.loading && self.loading.show();
      $.ajax({
        url: opts.url,
        success: function (ret) {
          self.loading && self.loading.hide();
          self.box[0].style.display = "";
          opts.onsuccess(ret)
        },
        error: function (ret) {
          opts.onerror(ret)
        }
      });
      //opts.onsuccess(undefined, '{start:"2013-11-1",end:"2013-12-31",dates:[]}');
    },
    _diffDate: function (date1, date2) {
      return date1.toDate().valueOf() - date2.toDate().valueOf();
    },
    _createExtraStatu: function (data) {
      var _getFormatStr = this._getFormatStr;
      data = data || {};
      var self = this,
        opts = self._opts,
        extraStatuArr = [],//用来保存日期列表
        year = this.Year,
        month = this.Month,//实际月份
        firstDay = new Date(year, month - 1, 1).getDay(),//本月第一天星期几, month 为 实际月份
        nextMonthFirstDay = new Date(year, month, 1).getDay(),//下月第一天星期几
        isDisplayExtraInfo = opts.isDisplayExtraInfo || false,
        isShowFestival = opts.isShowFestival;
      function setTypeAndText (extraObj) {
        //填充数据
        if( !state || !isDisplayExtraInfo ) {
          return;
        }
        var activityList = extraObj.activityList = state.activityList;
        for( var i = 0; i < activityList.length; i++ ) {
          var aListI = activityList[i];
          aListI.type = isDisplayExtraInfo ? (aListI ? aListI.type : 1) : undefined;
          aListI.text = isDisplayExtraInfo ? opts.text[aListI.type]: '';
        }
      }
      function setFestival (extraObj, year, month, day) {
        var recentDays = Festival.getRecentDays(year, month, day);
        if(isShowFestival) {
          extraObj.festival = Festival.getFestival(year, month, day, ['lunar', 'solar']);
        }
        //if( recentDays.today == '今天' ) {
        //  extraObj.festival = self._opts.festival['today'];
        //  extraObj.today = true;
        //}
      }
      //补充上月日历最后几天
      //firstDay == 0 && (firstDay += 7);
      for (var i = 1 - firstDay; i < 1; i++) {//i为当天与本月第一天的差值，负值
        var extraObj = {};
        var lastMonthI = new Date(year, month - 1, i).getDate();//当天日期值
        var thatDate = year + "-" + _getFormatStr(month - 1) + "-" + _getFormatStr(lastMonthI);
        var state = data[thatDate];
        setFestival(extraObj, year, month - 2, i);
        extraObj.date = lastMonthI;
        extraObj.fullDate = thatDate;
        setTypeAndText(extraObj, state);
        extraObj.whichMonth = 'lastMonth';
        extraStatuArr.push(extraObj);
      }
      //当月日历
      for (var i = 1, monthDay = new Date(year, month, 0).getDate(); i <= monthDay; i++) {
        var extraObj = {};
        var thatDate = year + "-" + _getFormatStr(month) + "-" + _getFormatStr(i);
        var state = data[thatDate];
        setFestival(extraObj, year, month - 1, i);
        extraObj.date = i;
        extraObj.fullDate = thatDate;
        setTypeAndText(extraObj, state);
        extraObj.whichMonth = 'currentMonth';
        extraStatuArr.push(extraObj);
      }
      //补齐下月日历前几天
      nextMonthFirstDay == 0 && (nextMonthFirstDay += 7);
      for (var i = nextMonthFirstDay, j = 1; i < 7; i++, j++) {//i为当天与下第一天的星期几，j为下月当天日期值
        var extraObj = {};
        var thatDate = year + "-" + _getFormatStr(month + 1) + "-" + _getFormatStr(j);
        var state = data[thatDate];
        setFestival(extraObj, year, month, i);
        extraObj.date = j;
        extraObj.fullDate = thatDate;
        setTypeAndText(extraObj, state);
        extraObj.whichMonth = 'nextMonth';
        extraStatuArr.push(extraObj);
      }
      return extraStatuArr;
    },
    drawExtraStatus: function (data) {
      var self = this,
        extraStatuArr = this._createExtraStatu(data),
        opts = this._opts;
      var html = _tmpl(opts.tpl, {
        data: {
          extraInfo: extraStatuArr,
          year: self.Year,
          month: self.Month,
          prevBtnCls: self._getDisable('last'),
          nextBtnCls: self._getDisable('next')
        }
      });
      this.box.html(html);
    },
    bindEvent: function () {
      var self = this;
      self.box.on('click', '.btn-month', function(e) {
        var $this = $(this);
        if ( $this.hasClass(self._opts.cls.prevDisable) || $this.hasClass(self._opts.cls.nextDisable) ) {
          return;
        } else if( $this.hasClass('last-month') ){
          self._drawPrevMonth();
        } else if( $this.hasClass('next-month') ){
          self._drawNextMonth();
        }
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
      if (title == "last") {
        var date1 = new Date(this.StartYear, this.StartMonth - 1);
        var date2 = new Date(this.Year, this.Month - 1);
        var isSame = this._compareDate(date1, date2);
        if (isSame < 0) {
          return this._opts.cls.prevEnable;
        } else {
          return this._opts.cls.prevDisable;
        }
      } else if (title == "next") {
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
      var onShowLastMonth = this._opts.onShowLastMonth;
      //先取得上一个月的日期对象
      var d = new Date(this.Year, this.Month - 2, 1);
      //再设置属性
      this.Year = d.getFullYear();
      this.Month = d.getMonth() + 1;
      //重新画日历
      this.drawExtraStatus(this.newData);
      if( typeof onShowLastMonth == 'function' ) {
        onShowLastMonth.call(this, this.Year, this.Month);
      }
    },
    //下一个月
    _drawNextMonth: function () {
      var onShowNextMonth = this._opts.onShowNextMonth;
      var d = new Date(this.Year, this.Month, 1);
      this.Year = d.getFullYear();
      this.Month = d.getMonth() + 1;
      this.drawExtraStatus(this.newData);
      if( typeof onShowNextMonth == 'function' ) {
        onShowNextMonth.call(this, this.Year, this.Month);
      }
    },
    date2Str: function (x, y) {
      var z = {M: x.getMonth() + 1, d: x.getDate(), h: x.getHours(), m: x.getMinutes(), s: x.getSeconds()};
      y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
      });
      return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
      });
    },
    _getFormatStr: function (num) {
      return num < 10 ? '0' + num : num.toString();
    }
  };
  win.fullCalendar = fullCalendar;
})(window);