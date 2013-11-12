#coding: utf-8
from mods.models import Mod
from mods.models import ModLayoutSupport
from mods.models import ModCSSRequire
from mods.models import ModJSRequire
from django.shortcuts import HttpResponse
from django.utils import simplejson
import time

def getMod(request):
    if request.method == "GET":
        # Query Params
        jsonp = request.GET.get('jsonp')
        modIdQuery   = request.GET.get('modId')
        typeIdQuery  = request.GET.get('typeId')
        layoutQuery  = request.GET.get('layout')
        isOnlineQuery= request.GET.get('isOnline')
        
        # 获取Mods
        modList = []
        mods = Mod.objects.all()
        
        # 筛选
        if modIdQuery is not None and modIdQuery != '':
            mods = mods.filter(pk=modIdQuery)
            
        if typeIdQuery is not None and typeIdQuery != '':
            mods = mods.filter(type=typeIdQuery)
            
        if isOnlineQuery == 'y':
            mods = mods.filter(is_online=True)
        elif isOnlineQuery == 'n':
            mods = mods.filter(is_online=False)
            
        if layoutQuery is not None and layoutQuery != '':
            layouts = layoutQuery.split(',')
            fitMods = ModLayoutSupport.objects.filter(layout_type__in=layouts)
            modPks = []
            for mod in fitMods:
                modPks.append(mod.pk)
            mods = mods.filter(pk__in=modPks)
        
        
        # 拼装JSON
        for item in mods:
            # 获取模块JS、CSS依赖文件列表
            jsRequireList  = ModJSRequire.objects.filter(mod=item)
            cssRequireList = ModCSSRequire.objects.filter(mod=item)
            jsURLList = []
            cssURLList = []
            for js in jsRequireList:
                jsURLList.insert(js.index, js.url)
            for css in cssRequireList:
                cssURLList.insert(css.index, css.url)
                
            # 拼装单个租价
            modList.append({
                            "id" : item.pk,
                            "name" : item.name,
                            "imgThumb" : item.img_thumb,
                            "typeId" : item.type.pk,
                            "typeName" : item.type.name,
                            "htmlTplStr" : item.html_tpl_str,
                            "demoJsonStr" : item.demo_json_str,
                            "jsRequire" : jsURLList,
                            "cssRequire" : cssURLList,
                            "lastModifiedTime" : long(time.mktime(item.last_modified_time.timetuple())*1000)
                        })
            
        JSONstr = simplejson.dumps( {
                                        "modList" : modList
                                    }, cls = simplejson.JSONEncoder )
        
        # 响应
        if jsonp is None or jsonp == '':
            return HttpResponse(JSONstr, mimetype="application/json")
        else:
            return HttpResponse(jsonp + '(' + JSONstr + ')', mimetype="application/javascript")
    
