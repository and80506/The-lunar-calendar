#coding: utf-8
from django.shortcuts import HttpResponse, render_to_response
from django.http import HttpResponseRedirect
from django import template
import time
from mods.models import Mod, ModJSRequire, ModCSSRequire, ModLayoutSupport, attach
from util.upload import Upload
from settings import FILE_UPLOAD_PATH
def addModuleResult(request):
    if request.method == "POST" :
        form =  request.POST
        modId  = Mod.objects.order_by('-id')[0].id
        #保存上传的附件
        if request.FILES.getlist('img_thumb'):
                uploadAttach = request.FILES.getlist('img_thumb')
                dbAttach = Upload().saveAttach(uploadAttach)
                attachId = dbAttach['attachId']
               # imgThumb = FILE_UPLOAD_PATH + dbAttach['file_path']
                imgThumb = "/omod/media/attach/"  + dbAttach['file_path']
        
        #新增mod表记录
        modTable = Mod(
                                name = form.get("name"),
                                img_thumb = imgThumb,
                                type_id = form.get("type"),
                                html_tpl_str = form.get("html_tpl_str"),
                                demo_json_str = form.get("demo_json_str"),
                                last_modified_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) ,
                                is_online = False
                                )
        modTable.save()
        
        #新增mod_js_require表记录
        jsRequire = form.get("mod_js_require")
        jsUrlList = jsRequire.split('\r\n')
        for jsUrl in jsUrlList :
            
            ModJSRequireTable = ModJSRequire(
                                        #@TO DO 组件从中间删除时，组件id从删除后的id+1，造成问题
                                        mod_id =  int(modId)+1,
                                        url = jsUrl,
                                        index = jsUrlList.index(jsUrl)
                                        )
            ModJSRequireTable.save()
            
        #新增mod_css_require表记录
        cssRequire = form.get("mod_css_require")
        cssUrlList = cssRequire.split('\r\n')
        for cssUrl in cssUrlList :
            ModCSSRequireTable = ModCSSRequire(
                                       mod_id =  int(modId)+1,
                                        url = cssUrl,
                                        index = cssUrlList.index(cssUrl)
                                        )
            ModCSSRequireTable.save()
        
        #新增mod_layout_support表记录
        checkbox_list = request.REQUEST.getlist('check_box_list')
        for checkedField in checkbox_list :
            ModLayoutSupportTable = ModLayoutSupport(
                                        mod_id =  int(modId)+1,
                                        layout_type = checkedField
                                        )
            ModLayoutSupportTable.save()
        
        return HttpResponse('OK')
                
