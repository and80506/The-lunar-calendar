#coding: utf-8
from mods.models import Mod, ModType, ModJSRequire, ModCSSRequire, ModLayoutSupport
from django.shortcuts import HttpResponse, render_to_response, render
from django.http import HttpResponseRedirect
from django import template

def showPage(request):
    mods = Mod.objects.all()
    mod_type_list = ModType.objects.all()
    
    if request.method == "GET":
        return render(request, 'index.html', {
                                                   'models' : {
                                                                       'mod_type_list' : mod_type_list,
                                                                       'mod' : mods,
                                                   }})
 #  根据组件类型位筛选组件
def showPageByType(request,type_id):
   mods = Mod.objects.filter(type = type_id)
   mod_type_list = ModType.objects.all()
   
   if request.method == "GET":
       return render(request, 'index.html', {
                                                  'models' : {
                                                                      'mod_type_list' : mod_type_list,
                                                                      'mod' : mods,
                                                  }})
# 根据组件支持的布局位筛选组件
def showPageByLayoutType(request,layout_type):
    layout_mods = ModLayoutSupport.objects.filter(layout_type = layout_type)
    queryList = []
    for layout_mod in layout_mods:
         queryList.append(layout_mod.mod_id)
    mods = Mod.objects.filter(id__in = queryList)
    mod_type_list = ModType.objects.all()
    
    if request.method == "GET":
        return render(request, 'mod_list.html', {
                                                   'models' : {
                                                                       'mod_type_list' : mod_type_list,
                                                                       'mod' : mods,
                                                   }})
#  组件detail信息
def showDetail(request,mod_id):
    mods = Mod.objects.all()
    mod = Mod.objects.filter(id = mod_id)[0]
    mod_type_list = ModType.objects.all()
    mod_js_require = ModJSRequire.objects.filter(mod = mod_id).order_by('index')
    mod_css_require = ModCSSRequire.objects.filter(mod = mod_id).order_by('index')
    mod_type = ModType.objects.filter(mod = mod_id)[0]
    
    if request.method == "GET":
        return render(request, 'detail.html', {
                                                   'models' : {
                                                                       'mod_js_require' : mod_js_require,
                                                                       'mod_css_require' : mod_css_require,
                                                                       'mod_type_list' : mod_type_list,
                                                                       'mod_type' : mod_type,
                                                                       'mod' : mod,
                                                   }})
