/**
 * PE数据封装
 */
define('get_pe_data.js', [''], function (require, exports, module) {
    //用于自定义事件的空对象
    var customEvent = $({});

    //获取分类数据的ajax请求url
    var cateServer = 'http://www.aliexpress.com/proengine/promotion_category_preview_ajax.htm';

    //获取产品数据的ajax请求url
    var productServer = 'http://www.aliexpress.com/proengine/promotion_category_product_preview_ajax.htm';

    //全部需要获取数据的PEId
    var peIdsArr = [];
    //用于保存所有的分类产品数据
    var cateList = [];
    //当前处理的PEId索引
    var index = 0;
    //当前请求数据的PEId
    var currentPeId = null;

    /**
     * 排序类目
     * @param {Array} array 待排序的数组.
     * @param {String} by 排序方式.
     */
    var _sortArray = function (arr, by) {
        var _sortBy = {};
        var _copy = [];
        var _tmp = [];
        var _curr, _csb, _rpt = 0;

        for (var i = 0, l = arr.length; i < l; i++) {
            _curr = arr[i];
            _csb = _curr[by];
            if (typeof _sortBy[_csb] != 'undefined') {
                _csb = _csb + '|' + (++_rpt);
            }
            _sortBy[_csb] = _curr;
            _tmp.push(_csb);
        }
        _tmp.sort();
        for (var i = 0, l = _tmp.length; i < l; i++) {
            _copy[i] = _sortBy[_tmp[i]];
        }
        return _copy;
    };

    /**
     * 根据活动id获取分类数据
     */
    var _getCategory = function () {
        currentPeId = peIdsArr[index];

        if (index < peIdsArr.length) {
            $.getJSON(cateServer + '?promotionId=' + currentPeId + '&jsonp=?', function (data) {
                //将分类按ID大小排序
                var _cateItem = _sortArray(data[currentPeId], 'id');
                var _cateIdArr = [];

                for (var i = 0, len = _cateItem.length; i < len; i++) {
                    _cateIdArr.push(_cateItem[i].id);
                }

                //获取全部分类下的产品数据
                _getCateProducts({
                    cateData: _cateItem,
                    cateIds: _cateIdArr.join(':')
                });
            });
        } else {
            //全部数据已经加载完
            customEvent.trigger('dataHasLoaded', [cateList]);
        }
    };

    /**
     * 获取倒计时表示的时间差
     */
    var _getRemainDate = function (timeStart, timeEnd) {
        var _diffSec = Math.round((timeEnd - timeStart) / 1000);
        var _hours = 0;
        var _minutes = 0;
        var _seconds = 0;

        if (_diffSec < 0) {
            return '{h:0, m:0, s:0}';
        } else {
            _seconds = _diffSec % 60;
            _minutes = Math.floor((_diffSec / 60) % 60);
            _hours = Math.floor(_diffSec / (60 * 60));

            return '{h:' + _hours + ', m:' + _minutes + ', s:' + _seconds + '}';
        }
    };

    /**
     * 加载产品数据
     * @param obj.cid {Number} 分类id.
     */
    var _getCateProducts = function (obj) {
        var _cateData = obj.cateData;
        var _cateIds = obj.cateIds;

        $.getJSON(productServer + '?promotionId=' + currentPeId + '&categoryIds=' + _cateIds + '&nums=' + _cateIds.replace(/\d+/g, 0) + '&jsonp=?', function (ajaxData) {
            //遍历当前PEId下的每个类目
            for (var i = 0, len = _cateData.length; i < len; i++) {
                var _cateId = _cateData[i]['id'];
                var _cateName = _cateData[i]['name'];
                var _productData = ajaxData['productlist'][_cateId];
                var _newProductData = [];

                for (var n = 0, m = _productData.length; n < m; n++) {
                    var _theProductData = _productData[n];
                    var _nowDate = new Date().getTime();
                    var _status = null;

                    if (_nowDate < _theProductData['ppStartTime']) {
                        _status = 1;
                    } else if (_nowDate > _theProductData['ppStartTime'] && _nowDate < _theProductData['ppEndTime']) {
                        _status = 2;
                    } else {
                        _status = 3;
                    }

                    _newProductData.push({
                        // 卖家MemberSequence
                        'ownerMemberSeq': _theProductData['ownerMemberSeq'],
                        // 产品ID
                        'productId': _theProductData['productId'],
                        // 产品名
                        'name': _theProductData['name'],
                        // 描述文案
                        'summary': _theProductData['summary'],
                        // 产品图片
                        'summImageURL': _theProductData['summImageURL'],
                        // 店铺Detail链接
                        'storeDetailURL': _theProductData['storeDetailURL'],
                        // Detail链接
                        'detailURL': _theProductData['detailURL'],
                        // 店铺首页
                        'storeHomeURL': _theProductData['storeHomeURL'],

                        // 最低现价
                        'newMinPrice': parseFloat(_theProductData['newMinPrice'], 10).toFixed(2),
                        // 最高现价
                        'newMaxPrice': parseFloat(_theProductData['newMaxPrice'], 10).toFixed(2),
                        // 最低原价
                        'oldMinPrice': parseFloat(_theProductData['oldMinPrice'] / 100, 10).toFixed(2),
                        // 最高原价
                        'oldMaxPrice': parseFloat(_theProductData['oldMaxPrice'] / 100, 10).toFixed(2),
                        // 节省金额
                        'save': (parseFloat(_theProductData['oldMinPrice'], 10) - parseFloat(_theProductData['newMaxPrice'], 10)).toFixed(2),

                        // 单位
                        'unit': _theProductData['packageType'],
                        // 复数单位
                        'multiUnit': _theProductData['multiUnit'],

                        // 是否展示折扣
                        'showDiscount': _theProductData['showDiscount'],
                        // 折扣率
                        'discount': _theProductData['discount'],

                        // 是否有库存
                        'hasQuantity': _theProductData['hasQuantity'],
                        // 库存数
                        'quantity': _theProductData['quantity'],
                        // 库存数单位
                        'quantityUnit': (_theProductData['quantity'] > 1) ? _theProductData['packageType'] : _theProductData['multiUnit'],

                        // 最小起订量
                        'minOrder': _theProductData['minOrder'],
                        // 是否免运费
                        'isFreeshipping': _theProductData['freeShipping'],


                        // 出单数
                        'order': 0,
                        // 出单数单位
                        'orderUnit': _theProductData['oddUnit'],

                        // 商品是否已售空
                        'isSoldout': _theProductData['isSoldout'],

                        //活动状态{1: 活动没开始 2: 活动进行中 3: 活动结束了}
                        'status': _status,
                        // 活动开始时间
                        'startTime': _theProductData['ppStartTime'],
                        // 活动结束时间
                        'endTime': _theProductData['ppEndTime'],

                        //开始倒计时
                        'startRemain': _getRemainDate(_nowDate, _theProductData['ppStartTime']),
                        //结束倒计时
                        'startRemain': _getRemainDate(_nowDate, _theProductData['ppEndTime'])
                    });

                }

                cateList.push({
                    'cateName': _cateName,
                    'cateId': _cateId,
                    'dataType' : 'PE',   //用于标识数据类型
                    'productList': _newProductData
                });
            }

            index++;
            //获取下一个PE数据
            _getCategory();
        });
    };

    return {
        onDataHasLoaded: function (func) {
            customEvent.bind('dataHasLoaded', func);
        },
        getData: function (peIdArr) {
            peIdsArr = peIdArr;
            _getCategory();
        }
    };
});

/**
 * gagadeal数据封装
 */
define('get_gaga_data.js', [''], function (require, exports, module) {
    //用于自定义事件的空对象
    var customEvent = $({});

    //gagadeal的ajax请求url
    var gagaServer = 'http://gaga.aliexpress.com/ajax_for_gaga_products.htm';
    //gagadeal分类数据
    var gagaData = {};
    //用于保存所有的分类产品数据
    var cateList = [];
    //当前处理的gagaId索引
    var index = 0;
    //当前请求数据的PEId
    var currentGagaId = null;

    /**
     * 将2012-08-12 12:09:09格式的时间变为数字表是的毫秒, 比如: 1345168277330
     */
    var _getTime = function (dateStr) {
        var _reg = /(\d+)\-(\d+)\-(\d+)\s(\d+)\:(\d+)\:(\d+)/g;
        var _result = _reg.exec(dateStr);

        if (_result) {
            return new Date(_result[1], _result[2], _result[3], _result[4], _result[5], _result[6]).getTime();
        }
    }

    //获取数据
    var _getGaGaData = function () {
        currentGagaId = gagaIdsArr[index];

        if (index < gagaIdsArr.length) {
            $.getJSON(gagaServer + '?promIds=' + currentGagaId + '&jsonp=?', function (ajaxData) {
                var _data = ajaxData['productList'][currentGagaId];

                _saveGagaDate(_data);
            });
        } else {
            for (k in gagaData) {
                cateList.push(gagaData[k]);
            }
            customEvent.trigger('dataHasLoaded', [cateList]);
        }
    };

    /**
     * 保存gagadeal数据
     */
    var _saveGagaDate = function (data) {
        var _data = data;

        for (var i = 0, len = _data.length; i < len; i++) {
            var _theCateId = _data[i]['gagaCatId'];

            if (!gagaData[_theCateId]) {
                gagaData[_theCateId] = {
                    'cateName': '',
                    'cateId': _theCateId,
                    'dataType' : 'GA',   //用于标识数据类型
                    'productList': []
                };
            }

            gagaData[_theCateId]['productList'].push({
                // 卖家MemberSequence
                'ownerMemberSeq': '',
                // 产品ID
                'productId': _data[i]['productId'],
                // 产品名
                'name': _data[i]['productName'],
                // 描述文案
                'summary': '',
                // 产品图片
                'summImageURL': _data[i]['promotionImgUrl'],
                // 店铺Detail链接
                'storeDetailURL': _data[i]['originalProductDetailUrl'],
                // Detail链接
                'detailURL': _data[i]['gagaDetailUrl'],
                // 店铺首页
                'storeHomeURL': 'http://www.aliexpress.com/store/' + _data[i]['originalProductDetailUrl'].replace(/http:\/\/.*?\/(\d+)\_\d+\.html$/gi, '$1'),

                // 最低现价
                'newMinPrice': parseFloat(_data[i]['price'] / 100, 10).toFixed(2),
                // 最高现价
                'newMaxPrice': parseFloat(_data[i]['price'] / 100, 10).toFixed(2),
                // 最低原价
                'oldMinPrice': parseFloat(_data[i]['originalPrice'] / 100, 10).toFixed(2),
                // 最高原价
                'oldMaxPrice': parseFloat(_data[i]['originalPrice'] / 100, 10).toFixed(2),
                // 节省金额
                'save': parseFloat((_data[i]['originalPrice'] - _data[i]['price']) / 100, 10).toFixed(2),

                // 单位
                'unit': _data[i]['oddUnit'],
                // 复数单位
                'multiUnit': _data[i]['multiUnit'],

                // 是否展示折扣
                'showDiscount': true,
                // 折扣率
                'discount': _data[i]['discount'],

                // 是否有库存
                'hasQuantity': (_data[i]['canOrderStock'] > 0) ? true : false,
                // 库存数
                'quantity': _data[i]['canOrderStock'],
                // 库存数单位
                'quantityUnit': (_data[i]['canOrderStock'] > 1) ? _data[i]['multiUnit'] : _data[i]['oddUnit'],

                // 最小起订量
                'minOrder': _data[i]['displayOrder'] + '/' + (_data[i]['displayOrder'] > 1) ? _data[i]['multiUnit'] : _data[i]['oddUnit'],

                // 出单数
                'order': _data[i]['stock'] - _data[i]['canOrderStock'],
                // 出单数单位
                'orderUnit': ((_data[i]['stock'] - _data[i]['canOrderStock']) > 1) ? _data[i]['multiUnit'] : _data[i]['oddUnit'],

                // 商品是否已售空
                'isSoldout': _data[i]['isSoldOut'],
                // 是否免运费
                'isFreeshipping': _data[i]['isFreeshipping'],

                //活动状态{1: 活动没开始 2: 活动进行中 3: 活动结束了}
                'status': _data[i]['status'],
                // 活动开始时间
                'ppStartTime': _getTime(_data[i]['ppStartDate']),
                // 活动结束时间
                'ppEndTime': _getTime(_data[i]['ppEndDate']),

                //开始倒计时
                'startRemain': _data[i]['remain'],
                //结束倒计时
                'startRemain': _data[i]['endRemain']
            });
        }

        index++;
        _getGaGaData();
    };

    return {
        onDataHasLoaded: function (func) {
            customEvent.bind('dataHasLoaded', func);
        },
        getData: function (idsArr) {
            gagaIdsArr = idsArr;
            _getGaGaData();
        }
    };
});


/**
 * csv数据封装
 */
define('get_csv_data.js', [''], function (require, exports, module) {
    //用于自定义事件的空对象
    var customEvent = $({});
    //自定义cateId,递增
    var customCateId = 153512;
    //build类目时上一组类目数据
    var lastCateArr = [];
    //全部类目数据
    var cateData = [];
    //build产品数据时最后一次使用的类目数据
    var lastCate = '';
    //全部产品数据
    var productData = {};
    //总行数
    var totalRow = 0;
    //当前处理到第几行产品信息
    var currentRow = 0;
    //获取线上页面数据的接口地址
    var productServer = 'http://w.alizoo.com/tools/getproductinfo/';
    
    /**
     * 拖拽上传
     */
    var _initDragUpload = function(_target){
        var _file = _target.get(0).files[0];
        var _reader = new FileReader();

        _reader.onload = function (e) {
            _parseCsvData(this.result);
        }
        _reader.readAsText(_file, 'gbk');
    };
    
    /*
     * 解析csv数据
     */
    var _parseCsvData = function(csvData){
        // 按换行分割读取的csv文件
        var _csvData = csvData.replace(/\n/g, '').split('\r');
        var _csvDataCount = csvData.length;
        var _viewmoreCol = null; //viewmore所在行位置

        for (var row = 0; row < _csvDataCount; row++) {
            //排除空行
            if (!_csvData[row]) {continue;}

            // csv一行数据中的所有列数据
            var _singleRowData = _getSingleRowData(_csvData[row]);
            
            if (row == 0) {
                //根据第一行确定viewmore的位置
                _viewmoreCol = _singleRowData.indexOf('viewmore');
            } else {
                if (_viewmoreCol == -1) {
                    alert('csv格式错误~');
                    return false;
                } else {
                    //获取产品信息
                    _getProductData(_singleRowData, _viewmoreCol);
                    //获取类目信息
                    _getCateData(_singleRowData, _viewmoreCol);
                }
            }
        }
    };

    /**
     * 获取类目信息
     */
    var _getCateData = function (data, endCol) {
        for (var i = 0; i < endCol; i++) {
            var _cateName = data[i];
            
            if (_cateName != '' && _cateName != lastCateArr[i]){
                lastCateArr[i] = _cateName;

                if (i == (endCol - 1)) {
                    cateData[i] = {
                        'cateName': _cateName,
                        'cateId': '', //可以用cache.customCateId代替
                        'dataType' : 'CSV',   //用于标识数据类型
                        'productList': productData[_cateName]
                    };
                } else {
                    cateData[i] = {
                        'cateName': _cateName,
                        'cateId': '', //可以用cache.customCateId代替
                        'cateList': []
                    };
                }
                
                if(i>0){
                    cateData[i-1]['cateList'].push(cateData[i]);
                }
            }

            lastCateArr[i] = _cateName;
        }
    };
    


    /**
     * 根据productId从线上页面获取数据
     */
    var _getServerData = function(cateName, pid, pData){
        $.getJSON(productServer +'?pid='+ pid +'&callback=?', function(dataItem){
            var _theProductData = dataItem[0]

            $.extend(_theProductData, pData);

            productData[cateName].push(_theProductData);

            currentRow++;

            if(currentRow == totalRow){
                customEvent.trigger('dataHasLoaded', [cateData[0]]);
            }
        })
    };

    /**
     * 获取产品信息
     * 这里是按顺序取的,所以csv中字段顺序不能变
     */
    var _getProductData = function (data, startCol) {
        var _cateName = data[startCol - 1];
        var _productId = _getProductId(data[startCol + 3]);
        var _pData = {};

        //类目为空, 表示跟上一条数据是相同的类目
        if (_cateName == '') {_cateName = lastCate;}

        if (data[startCol + 1]) {
            if (!productData[_cateName]) {
                productData[_cateName] = [];
            }

            _pData = {
                'productId': _getProductId(data[startCol + 3]),
                // 产品名
                'name': data[startCol + 1],
                // 产品图片
                'summImageURL': data[startCol + 2],
                // 店铺Detail链接
                'storeDetailURL': data[startCol + 4],
                // Detail链接
                'detailURL': data[startCol + 3],
                // 店铺首页
                'storeHomeURL': 'http://www.aliexpress.com/store/' + data[startCol + 4].replace(/http:\/\/.*?\/(\d+)\_\d+\.html$/gi, '$1'),

                // save
                'save': data[startCol + 6],
            };

            totalRow++;

            _getServerData(_cateName, _productId, _pData);
        }

        //保存上一次使用的类目
        lastCate = _cateName;
    };

    /**
     * 返回csv中一行中的全部列数据
     * 需要考虑逗号、双引号的情况
     * @return {Array} 当前行的全部列数据.
     */
    var _getSingleRowData =  function (str) {
        var _colItem = null;
        var _colItemCount = 0;
        var _startIndex = null;
        var _endIndex = null;
        var _isDone = true;
        var _tmpItem = [];
    
        if(str.indexOf(',') != -1){
            _colItem = str.replace(/\"\"/gi, '&#34;').split(',');
            _colItemCount = _colItem.length;
        }

        for (var i = 0; i < _colItemCount; i++) {
            // 没有","的情况

            if (_colItem[i].match(/^\".*?\"$/g)) {
                _startIndex = _endIndex = i;
                _tmpItem.push(_colItem[i].replace(/\"/g, ''));
            } else {
                /**
                 * 内容中有逗号, 再用逗号分割字符串时会被分成若干段
                 * 如果发现某个字符串开始的位置有逗号, 但是结尾并没有则表示内容被分割成了若干小段
                 */
                if (_colItem[i].match(/^\".*?[^\"]$/g)) {
                    _startIndex = i;
                    _isDone = false;
                    _tmpItem.push(_colItem[i].replace(/^\"/g, ''));
                } else {
                    if (!_isDone) {
                        // 在某个字符串末尾发现双引号则该行结束
                        if (_colItem[i].match(/\"$/g)) {
                            _isDone = true;
                            _endIndex = i;
                            _tmpItem.push(_colItem[i].replace(/\"$/g, ''));
                        } else {
                            _tmpItem.push(_colItem[i]);
                        }
                    }
                }
            }
        }

        if (_startIndex != null && _endIndex != null) {
            _colItem.splice(_startIndex, (_endIndex - _startIndex + 1), _tmpItem.join(','));
        }

        return _colItem;
    };

    /**
     * 根据detail_url获取productid
     */
    var _getProductId = function (url) {
        var _standaloneDetailUrlReg = /http\:\/\/www\.aliexpress\.com\/product-[^/]+\/(\d+)-.*/i;
        var _storeDetailReg = /http\:\/\/www\.aliexpress\.com\/(?:[^/-]+-)?store\/product\/[^/]+\/\d+_(\d+)\.html?/i;
        var _oldStoreDetailReg = /http\:\/\/www\.aliexpress\.com\/(?:[^/-]+-)?store\/\d+\/\d+-(\d+)\/.*/i;

        if (_standaloneDetailUrlReg.test(url)) {
            return RegExp.lastParen;
        } else if (_storeDetailReg.test(url) || _oldStoreDetailReg.test(url)) {
            return RegExp.lastParen;
        } else {
            return null;
        }
    };

    return {
        onDataHasLoaded: function (func) {
            customEvent.bind('dataHasLoaded', func);
        },
        getData: function (target) {
            _initDragUpload(target);
        }
    };
});


/*
$(function(){
    var loadedNum = 0;
    var cateData = [];

    var loadDataDone = function(data){
        cateData = cateData.concat(data);
        loadedNum++;

        if(loadedNum == 3){
            console.log(cateData);
        }
    }

    seajs.use('get_pe_data.js', function(pe) {
       pe.onDataHasLoaded(function(ev, data){
          loadDataDone(data);
       })
       pe.getData([200110180,200108977,200108986]);
    });

    seajs.use('get_gagadeal_data.js', function(gaga) {
       gaga.onDataHasLoaded(function(ev, data){
          loadDataDone(data);
       })
       gaga.getData([200109995]);
    });

    seajs.use('get_csv_data.js', function (csv) {
        csv.onDataHasLoaded(function (ev, data) {
            loadDataDone(data);
        });
        csv.getData($('#csvfile'));
    });
})
*/