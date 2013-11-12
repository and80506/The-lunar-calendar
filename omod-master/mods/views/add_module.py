#coding: utf-8
from mods.models import Mod, ModType, ModLayoutSupport
from django.shortcuts import HttpResponse, render_to_response, render
from django.http import HttpResponseRedirect
from django import template
def addModule(request):
    mods = Mod.objects.all()
    # 填充组件类型表
   
    mod_type_list = ModType.objects.all()
    mod_layout_support = [
                         {'mod_id' : 1, 'layout_type' : '通栏布局主区块' , 'name' : 'CM1' },
                         {'mod_id' : 2, 'layout_type' : '两栏布局主区块', 'name' : 'CM2' },
                         {'mod_id' : 3, 'layout_type' : '三栏布局主区块', 'name' : 'CM3' },
                         {'mod_id' : 4, 'layout_type' : '侧边栏区块', 'name' : 'SUB' },
                         {'mod_id' : 5, 'layout_type' : '右侧扩展侧边栏区块', 'name' : 'EXT' }
                         ]
    if request.method == "GET":
        return render(request, 'add_models.html', {
                                                   'models' : {
                                                                       'mod_type_list' : mod_type_list,
                                                                       'mod_layout_support' : mod_layout_support
                                                   }})
        
