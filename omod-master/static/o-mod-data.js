define('o-mod-data.js', ['run/intl-activities/app/mustache/mustache-0.5.2.js'], function(require, exports, module) {
	var nModData = null;
	var Mustache = require('run/intl-activities/app/mustache/mustache-0.5.2.js');

	var modData = function(){
		this.cache = {
			//待加载的数据量
			count : 0,
			//已经加载完的数据量
			loadedCount : 0,
			//分类及产品数据
			cateData : [],
			dataNode : null,
			gagaNode : null,
			peNode : null,
			csvNode : null,
			dataBtn : null,

			//已选择的组件
			selectedMods : {},

			//model是否已经选择
			isModSelected : false,

			//目标模块
			targetMod : null,
			//组件需要的产品数
			modGitemsNum : 0,
			//组件的模板
			targetTmp : ''
		};

		//用于自定义事件的空对象
		this.customEvent = $({});
	};
	modData.prototype = {
		init: function(){
			this.buildDom();

			this.bind();
		},

		/**
		 * 获取url参数中的值
		 */
		getParam : function(url,name){
		    var r = new RegExp("\\?(?:.+&)?" + name.toLowerCase() + "=(.*?)(?:&.*)?$");
		    var m = url.toLowerCase().match(r);
		    return m ? m[1] : "";
		},

		/**
		 * 创建数据面板
		 * @return {object} dataNode
		 */
		buildDom: function(){
			var cache = this.cache;
			var dataHtml = [];

			cache.dataNode = $('<dl class="o-mod-data" id="o-mod-data"></dl>');
			dataHtml = [
				'<dt>输入数据</dt>',
				'<dd>',
					'<div class="o-modd-form" id="o-modd-form">',
						'<ul>',
							'<li><label>GaGa ID(每行一个)</label><textarea class="inp-atext" id="o-mod-data-gaga"></textarea></li>',
							'<li><label>PE ID(每行一个)</label><textarea class="inp-atext" id="o-mod-data-pe">200122406</textarea></li>',
							'<li><label>CSV File</label>',
							'<span><input class="inp-text" type="text" name="" value="" /><button>浏览</button></span>',
							'<input id="o-mod-data-csv" class="inp-file" type="file" id="o-mod-csv" /></li>',
						'</ul>',
						'<div class="o-mod-btn"><input id="o-mod-data-btn" class="inp-btn" type="button" name="" value="确定" /></div>',
					'</div>',
					'<div class="o-modd-list" id="o-modd-list"></div>',		
				'</dd>'
			];

			this.cache.dataNode.html(dataHtml.join(''));
			$('body').append(cache.dataNode);

			cache.gagaNode = $('#o-mod-data-gaga');
			cache.peNode = $('#o-mod-data-pe');
			cache.csvNode = $('#o-mod-data-csv');
			cache.dataBtn = $('#o-mod-data-btn');
		},

		/**
		 * 绑定解析各种数据的事件
		 */
		bind: function(){
			var cache = this.cache;

			//渲染数据
			cache.dataBtn.bind('click', this, function(e){
				var data = [];

				data.push({type: 'gaga', val: $.trim(cache.gagaNode.val())});
				data.push({type: 'pe', val: $.trim(cache.peNode.val())});
				data.push({type: 'csv', val: $.trim(cache.csvNode.val())});

				for(var i=0; i<3; i++) {
					if(data[i].val != ''){
						cache.count++;

						seajs.use('get_'+ data[i].type +'_data.js', function(factory) {
							factory.onDataHasLoaded(function(ev, data){
								e.data.loadDataDone(data);
							});

							if(data[i].type == 'csv'){
								factory.getData(cache.csvNode);
							}else{
								factory.getData(data[i].val.split('\n'));
							}
						});
					}
				}

				$('#o-modd-form').hide();
				$('#o-modd-list').addClass('o-modd-loading').show();
				$('#o-mod-data dd').animate({width:'480px', height:'100px'}, 200);

				$('#o-mod-data').animate({width:'503px', right:'5px', height:'400px'}, 200);
			});

			//显示隐藏ID面板
			$('#o-mod-data dt').click(function(){
				var modDataNode = $('#o-mod-data');
				if(!modDataNode.hasClass('o-mod-data-active')){
					modDataNode.addClass('o-mod-data-active').animate({right: '5px', height:'auto'}, 150);
				}else{
					if($('.o-modd-form:visible').length){
						modDataNode.removeClass('o-mod-data-active').animate({right: '-165px'}, 150);
					}else{
						modDataNode.removeClass('o-mod-data-active').animate({right: '-485px'}, 150);
					}
				}
			});

			//处理文件域
			cache.csvNode.change(function(){
				var fileName = $(this).val().replace(/^.*?\/([^\/]*)$/gi, '$1');
				if(!fileName.match(/\.csv$/)){
					alert('请选择csv文件~');
					$(this).val('');
				}else{
					$(this).attr('title', fileName).parent().find('.inp-text').val(fileName);
				}
			});

			/*选择组件
			$('#page-of-mod-list .inp-checkbox input').live('click', this, function(e){
				var urlParam = $(this).parents('li').find('a').attr('href');
				var type = e.data.getParam(urlParam, 'type');
				var file = e.data.getParam(urlParam, 'file');

				cache.selectedMods[type] = cache.selectedMods[type] || [];
				
				if($(this).get(0).checked){
					cache.selectedMods[type].push(file);
				}else{
					var index = cache.selectedMods[type].indexOf(file);
					if(index != -1){
						cache.selectedMods[type].splice(index, 1);
					}
				}

				e.stopPropagation();
			});

			//渲染选中的组件
			$('#o-mod-buildpage').bind('click', this, function(e){
				e.data.customEvent.trigger('renderMod', [cache.selectedMods]);
			});
			*/
		},

		/**
		 * 
		onRenderMod: function(func){
			this.customEvent.bind('renderMod', func);
		},
		*/

		/**
		 * 加载完数据后的回调方法
		 */
		loadDataDone: function(data){
			var cache = this.cache;

			cache.loadedCount++;
			cache.cateData = cache.cateData.concat(data);

			if(cache.count == cache.loadedCount){
				$('#o-modd-list').removeClass('o-modd-loading').parent().css({height:'auto'});
				//显示类目产品数据
				this.showCateList();
			}
		},

		showCateList: function(){
			var self =  this;
			var cateData = this.cache.cateData;
			var len = cateData.length;
			var cateHtml = [];

			for(var i=0; i<len; i++){
				var productData = cateData[i]['productList'];
				var itemClass = (i == 0) ? "cate-item-active" : "";


				cateHtml.push(
					'<div class="cate-item ', itemClass ,'" data-index="', i ,'" data-type="', cateData[i]['dataType'] ,'" data-id="', cateData[i]['cateId'] ,'">', 
						'<h4><label class="inp-checkbox"><input type="checkbox" name="" />', cateData[i]['cateName'] ,'</label></h4>',
						'<div class="cate-item-box"><ul>'
				);

				for(var n=0, pl=productData.length; n<pl; n++) {
					cateHtml.push(
						'<li data-index="', n ,'">',
							'<label><img src="', productData[n]['summImageURL'] ,'" /><input type="checkbox" class="inp-checkbox" name="" /></label>',
						'</li>'
					);
				}

				cateHtml.push(
						'</ul></div>',
					'</div>'
				);
			}

			if(this.cache.isModSelected){
				cateHtml.push('<div id="o-modd-btn" class="o-modd-btn o-modd-btn-active"><button>确定</button></div>');
			}else{
				cateHtml.push('<div id="o-modd-btn" class="o-modd-btn"><button>确定</button></div>');
			}

			$('#o-modd-list').html(cateHtml.join('')).find('h4').bind('click', function(){
				var parentNode = $(this).parent();

				if(parentNode.hasClass('cate-item-active')){
					parentNode.removeClass('cate-item-active');
				}else{
					$('#o-modd-list .cate-item-active').removeClass('cate-item-active');
					parentNode.addClass('cate-item-active');
				}
			}).find('.inp-checkbox').click(function(e){
				var checkBox = $(this).find('input');
				var itemCheckBox = $(this).parents('.cate-item').find('.inp-checkbox');

				if(checkBox.get(0).checked){
					itemCheckBox.attr('checked', 'checked');
				}else{
					itemCheckBox.removeAttr('checked');
				}
				e.stopPropagation();
			});

			$('#o-modd-btn button').bind('click',function(e){
				var gData = {productList: []};

				$('#o-modd-list .inp-checkbox').each(function(){
					var cateNode = $(this).parents('.cate-item');
					var cateIndex = cateNode.attr('data-index');
					var cateId = cateNode.attr('data-id');
					var gIndex = $(this).parents('li').attr('data-index');

					if($(this).get(0).checked && $(this).prev().is('img') && gData['productList'].length < self.cache.modGitemsNum){
						if(cateData[cateIndex] && cateData[cateIndex]['productList'] && cateData[cateIndex]['productList'][gIndex]){
							gData['productList'].push(cateData[cateIndex]['productList'][gIndex]);
						}
					}
				});

				if(gData['productList'].length > 0){
					self.renderMod({data: gData});	
				}else{
					alert('没有选择任何数据~');
				}
			});
		},

		/**
		 * 渲染组件
		 * @param {Object} obj.data 产品数据
		 */
		renderMod: function(obj){
			var cache = this.cache;
			var modClass = cache.targetMod.attr('class');
			var modIndex = cache.targetMod.attr('data-index');
			var modOpt = cache.targetMod.find('.omod-opt');
			var html = $(Mustache.to_html(cache.targetTmp, obj.data));
			html.attr({
				'class': modClass,
				'data-index': modIndex
			}).append(modOpt.clone(true));
			
			cache.targetMod.replaceWith(html);
		},

		/**
		 * 显示数据面板
		 * @param {Object} obj.target 目标组件
		 * @param {String} obj.tmp 模板
		 */
		showDataPanl: function(obj){
			this.cache.isModSelected = true;

			$('#o-mod-data dt').trigger('click');
			$('#o-modd-btn').addClass('o-modd-btn-active');

			this.cache.targetMod = obj.target;
			this.cache.targetTmp = obj.tmp;
			this.cache.modGitemsNum = obj.target.find('.g-items').size();
		}
	};

	return {
		init: function(){
			nModData = new modData();
			nModData.init();
		},
		showDataPanl: function(obj){
			nModData.showDataPanl(obj);
		}
	};
});