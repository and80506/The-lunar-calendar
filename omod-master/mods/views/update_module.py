#coding: utf-8
from mods.models import Mod, ModType, ModJSRequire, ModCSSRequire, ModLayoutSupport
from django.shortcuts import HttpResponse, render_to_response, render
from django.http import HttpResponseRedirect
from django import template

def updateModule(request,update_mod_id):
    mods = Mod.objects.all()
    # 填充组件类型表
    mod = Mod.objects.filter(id = update_mod_id)[0]
    mod_js_require = ModJSRequire.objects.filter(mod = update_mod_id)[0]
    mod_css_require = ModCSSRequire.objects.filter(mod = update_mod_id)[0]
    mod_layout_support_sellect = ModLayoutSupport.objects.filter(mod = update_mod_id)
    mod_type_list = ModType.objects.all()
    def isCheckedField(checkboxList, verifyField) :
        for mod_i in checkboxList :
            if mod_i.layout_type == verifyField:
                return 'checked'
        return ''
    mod_layout_support = [
                         {'mod_id' : 1, 'layout_type' : '通栏布局主区块' , 'name' : 'CM1' ,'isChecked' : isCheckedField(mod_layout_support_sellect, 'CM1')},
                         {'mod_id' : 2, 'layout_type' : '两栏布局主区块', 'name' : 'CM2' ,'isChecked' : isCheckedField(mod_layout_support_sellect, 'CM2')},
                         {'mod_id' : 3, 'layout_type' : '三栏布局主区块', 'name' : 'CM3' ,'isChecked' : isCheckedField(mod_layout_support_sellect, 'CM3')},
                         {'mod_id' : 4, 'layout_type' : '侧边栏区块', 'name' : 'SUB' ,'isChecked' : isCheckedField(mod_layout_support_sellect, 'SUB')},
                         {'mod_id' : 5, 'layout_type' : '右侧扩展侧边栏区块', 'name' : 'EXT' ,'isChecked' : isCheckedField(mod_layout_support_sellect, 'EXT')}
                         ]
   
    if request.method == "GET":
        return render(request, 'update_models.html', {
                                                   'models' : {
                                                                       'mod_type_list' : mod_type_list,
                                                                       'mod_layout_support' : mod_layout_support,
                                                                       'mod_layout_support_sellect' : mod_layout_support_sellect,
                                                                       'mod_js_require' : mod_js_require,
                                                                       'mod_css_require' : mod_css_require,
                                                                       'mod' : mod,
                                                                       'mod_id' : update_mod_id,
                                                                       'selectedIndex' : mod.type_id
                                                   }})