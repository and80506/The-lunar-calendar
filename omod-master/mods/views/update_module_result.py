#coding: utf-8
from django.shortcuts import HttpResponse, render_to_response
from django.http import HttpResponseRedirect
from django import template
import time
from mods.models import Mod, ModJSRequire, ModCSSRequire, ModLayoutSupport, attach
from util.upload import Upload
from settings import FILE_UPLOAD_PATH
def updateModuleResult(request):
    if request.method == "POST" :
        form =  request.POST
        modId  = form.get("form_id")
        mod = Mod.objects.filter(id = modId)[0]
        #保存上传的附件
        if request.FILES.getlist('img_thumb'):
                uploadAttach = request.FILES.getlist('img_thumb')
                dbAttach = Upload().saveAttach(uploadAttach)
                attachId = dbAttach['attachId']
                imgThumb = "/omod/media/attach/" + dbAttach['file_path']
                #如果不上传组件缩略图则不更新组件缩略图
                mod.img_thumb =  imgThumb
                
        #更新mod表记录
        mod.type_id =  form.get("type")
        mod.html_tpl_str =  form.get("html_tpl_str")
        mod.demo_json_str =  form.get("demo_json_str")
        mod.last_modified_time =  time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        mod.isOnline = False
        mod.save()
        
        #更新mod_js_require表记录
        jsRequire = form.get("mod_js_require")
        ModJSRequire.objects.filter(mod = modId).delete()
        jsUrlList = jsRequire.split('\r\n')
        for jsUrl in jsUrlList :
            
            ModJSRequireTable = ModJSRequire(
                                        mod_id =  int(modId),
                                        url = jsUrl,
                                        index = jsUrlList.index(jsUrl)
                                        )
            ModJSRequireTable.save()
        
        #更新mod_css_require表记录
        cssRequire = form.get("mod_css_require")
        ModCSSRequire.objects.filter(mod = modId).delete() 
        cssUrlList = cssRequire.split('\r\n')
        for cssUrl in cssUrlList :
            ModCSSRequireTable = ModCSSRequire(
                                       mod_id = int(modId),
                                        url = cssUrl,
                                        index = cssUrlList.index(cssUrl)
                                        )
            ModCSSRequireTable.save()
        
        #更新mod_layout_support表记录
        ModLayoutSupport.objects.filter(mod = modId).delete()
        checkbox_list = request.REQUEST.getlist('check_box_list')
        for checkedField in checkbox_list :
            ModLayoutSupportTable = ModLayoutSupport(
                                        mod_id =  int(modId),
                                        layout_type = checkedField
                                        )
            ModLayoutSupportTable.save()
            
        return HttpResponse('OK')