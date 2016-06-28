/*
 *@author szwu.ctrip.com 2013.11.7
 *获取农历日期，节气，农历节日，公历节日等
 */
(function(win) {
  win.Festival = {
    curDay: new Date().getDate(),
    curMonth: new Date().getMonth(),
    curYear: new Date().getFullYear(),
    /*
     *@name:lunarInfo
     *@for example: ox-04bd8:
     *第一位0表示当年闰月为29天;   uesed for@leapDays
     *第五位8表示当年存在闰月，闰8月 uesed for@leapMonth
     */
    lunarInfo: new Array(
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
      0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
      0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
      0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
      0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
      0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
      0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
      0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
      0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
      0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
      0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
      0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0),
    //每年的正小寒点到各节期正节期点（即十五度倍数点）的分种数。
    sTermInfo: new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758),
    solarTerm: new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"),
    lFtv: new Array("0101*春节", "0115 元宵节", "0505 端午节", "0707 七夕情人节", "0715 中元节", "0815 中秋节", "0909 重阳节", "1208 腊八节", "1224 小年", "1230*除夕"),
    sFtv: new Array("0101*元旦", "0214 情人节", "0308 妇女节", "0312 植树节", "0325 速卖通周年", "0501 劳动节", "0504 青年节", "0601 儿童节", "0927世界旅游日", "1001 国庆节", "1002 国庆节", "1003 国庆节", "1111 双十一", "1224 圣诞夜", "1225*圣诞节"),
    //==== 传回农历 y年的总天数
    lYearDays: function (y) {
      var i, sum = 348, lunarInfo = this.lunarInfo;
      for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
      return (sum + this.leapDays(y))
    },

    //==== 传回农历 y年闰月的天数
    leapDays: function (y) {
      if (this.leapMonth(y)) return ((this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
      else return (0)
    },
    //==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
    leapMonth: function (y) { return (this.lunarInfo[y - 1900] & 0xf) },
    //====================================== 传回农历 y年m月的总天数
    monthDays: function (y, m) { return ((this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29) },
    monthDay: function (m) {
      var ry = 30,
        curYear = this.curYear;
      if (m == 1) {// 判断闰年2月
        if ((curYear % 4 == 0 && curYear % 100 != 0) || curYear % 400 == 0) {
          ry = 29;
        } else {
          ry = 28;
        }
      } else if ((m % 2 == 0 && m < 7) || (m >= 7 && m % 2 == 1)) {
        ry = 31;
      }
      return ry;
    },
    //==== 算出农历, 传入日期物件, 传回农历日期物件
    //   该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
    /*
     *.year .month .day 表示农历年月日
     *.isLeap 是否闰月
     *.yearCyl
     *.dayCyl
     *.monCyl
     */
    getLunarDate: function (objDate/*Date型*/) {
      var i, leap = 0, temp = 0, lunarDate = {};
      var baseDate = new Date(1900, 0, 31);//以1900年为基点
      var offset = (objDate - baseDate) / 86400000;//1天=86400000ms，objDate距离1900年1月31日的天数

      lunarDate.dayCyl = offset + 40
      lunarDate.monCyl = 14

      for (i = 1900; i < 2050 && offset > 0; i++) {
        temp = this.lYearDays.call(this, i)
        offset -= temp
        lunarDate.monCyl += 12
      }
      if (offset < 0) {
        offset += temp;
        i--;
        lunarDate.monCyl -= 12
      }

      lunarDate.year = i
      lunarDate.yearCyl = i - 1864

      leap = this.leapMonth.call(this, i) //闰哪个月
      lunarDate.isLeap = false

      for (i = 1; i < 13 && offset > 0; i++) {
        //闰月
        if (leap > 0 && i == (leap + 1) && lunarDate.isLeap == false)
        { --i; lunarDate.isLeap = true; temp = this.leapDays.call(this, lunarDate.year); }
        else
        { temp = this.monthDays.call(this, lunarDate.year, i); }

        //解除闰月
        if (lunarDate.isLeap == true && i == (leap + 1)) lunarDate.isLeap = false

        offset -= temp
        if (lunarDate.isLeap == false) lunarDate.monCyl++
      }

      if (offset == 0 && leap > 0 && i == leap + 1)
        if (lunarDate.isLeap)
        { lunarDate.isLeap = false; }
        else
        { lunarDate.isLeap = true; --i; --lunarDate.monCyl; }

      if (offset < 0) { offset += temp; --i; lunarDate.monCyl; }

      lunarDate.month = i
      lunarDate.day = offset + 1
      return lunarDate;
    },
    //获取某一天的农历节日
    getLunarFestival: function (lDObj/*农历日期*/) {
      var tmp1, tmp2, lFtv = this.lFtv, lunarFestival = '';
      for (var i = 0; i < lFtv.length; i++) {
        if (lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
          tmp1 = Number(RegExp.$1) - lDObj.month
          tmp2 = Number(RegExp.$2) - lDObj.day
          if (tmp1 == 0 && tmp2 == 0) lunarFestival = RegExp.$4
        }
      }
      return lunarFestival;
    },
    //获取某一天的国历节日
    getSolarFestival: function (mm, dd) {
      var tmp1, tmp2, sFtv = this.sFtv, solarFestival = '';
      mm = this._addPrefixForDate({mm: mm}).mm;
      dd = this._addPrefixForDate({dd: dd}).dd;
      for (var i = 0; i < sFtv.length; i++) {
        if (sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
          tmp1 = Number(RegExp.$1) - (mm + 1)
          tmp2 = Number(RegExp.$2) - dd
          if (tmp1 == 0 && tmp2 == 0) solarFestival = RegExp.$4
        }
      }
      return solarFestival;
    },
    //获取某一天的节气:@return '小寒'
    getSolarTerms: function (yyyy, mm, dd) {
      var tmp1, tmp2, solarTerms = '';
      yyyy = this._addPrefixForDate({yyyy: yyyy}).yyyy;
      mm = this._addPrefixForDate({mm: mm}).mm;
      dd = this._addPrefixForDate({dd: dd}).dd;
      /*
       *31556925974.7为地球公转周期，单位是毫秒,265.242199天
       *( 31556925974.7*(y-1900) + sTermInfo[n]*60000 )----表示y年的第n个节气点（15倍数度点）距1900年的小寒点的毫秒数。
       *Date.UTC(1900, 0, 6, 2, 5)表示1900年一年六日两点五分是正小寒点。
       */
      tmp1 = new Date((31556925974.7 * (yyyy - 1900) + this.sTermInfo[mm * 2 + 1] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
      tmp2 = tmp1.getUTCDate()
      if (tmp2 == dd) solarTerms = this.solarTerm[mm * 2 + 1]
      tmp1 = new Date((31556925974.7 * (yyyy - 1900) + this.sTermInfo[mm * 2] * 60000) + Date.UTC(1900, 0, 6, 2, 5))
      tmp2 = tmp1.getUTCDate()
      if (tmp2 == dd) solarTerms = this.solarTerm[mm * 2]

      return solarTerms;
    },
    //获取是否今明后天
    getRecentDays: function (yyyy, mm, dd) {
      var returned = {};
      if (yyyy == this.curYear && mm == this.curMonth) {
        if (dd == this.curDay) {
          returned.today = "今天"
        }
        if (dd - this.curDay == 1) {
          returned.tomorrow = "明天"
        }
        if (dd - this.curDay == 2) {
          returned.dopodomani = "后天"
        }
      } else if (yyyy == this.curYear && mm == this.curMonth + 1) {
        var ttd = this.monthDay(mm - 1) + parseInt(dd);
        if (ttd - this.curDay == 1) {
          returned.tomorrow = "明天"
        }
        if (ttd - this.curDay == 2) {
          returned.dopodomani = "后天"
        }
      }
      return returned;
    },
    /*
     * 获取节日:@return优先国历节日->农历节日->节气->今明后
     * @param cols {Array} ['lunar', 'solar', 'terms', 'today', 'tomorrow', 'dopodomani']
     */
    getFestival: function (yyyy, mm, dd, cols) {
      yyyy = this._addPrefixForDate({yyyy: yyyy}).yyyy;
      mm = this._addPrefixForDate({mm: mm}).mm;
      dd = this._addPrefixForDate({dd: dd}).dd;
      var sDObj = new Date(yyyy, mm, dd);
      var lDObj = this.getLunarDate(sDObj);//农历
      var festival = '' //节日，从国历，农历，节气，今明后这个四个值中按优先取值
        solarFestival = '', //国历节日
        lunarFestival = '', //农历节日
        solarTerms = '', //节气;
        recentDays = '';
      //农历节日
      lunarFestival = this.getLunarFestival(lDObj);

      //国历节日
      solarFestival = this.getSolarFestival(mm, dd);

      //节气
      solarTerms = this.getSolarTerms(yyyy, mm, dd);

      //今明后
      recentDays = this.getRecentDays(yyyy, mm, dd);
      var map = {
        lunar: lunarFestival,
        solar: solarFestival,
        terms: solarTerms,
        today: recentDays.today,
        tomorrow: recentDays.tomorrow,
        dopodomani: recentDays.dopodomani
      };
      for( var i = 0; i < cols.length; i++ ) {
        var col = cols[i];
        if( map[col] != '' ) {
          festival = map[col];
          break;
        }
      }
      return festival;
    },
    _addPrefixForDate: function (opts/*keys:yyyy, mm, dd*/) {
      var yyyy = opts.yyyy, mm = opts.mm, dd = opts.dd;
      yyyy && (yyyy = (yyyy > 200) ? yyyy : 2000 + yyyy);
      if (mm && mm >= 10) { mm = mm; } else { mm = "0" + mm; }
      if (mm && dd >= 10) { dd = dd; } else { dd = "0" + dd; }
      return opts;
    }
  };
})(window);