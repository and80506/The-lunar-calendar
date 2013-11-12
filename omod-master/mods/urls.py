#coding: utf-8
from django.conf.urls.defaults import patterns, url

from mods.views.add_module import addModule
from mods.views.update_module import updateModule
from mods.views.update_module_result import updateModuleResult
from mods.views.add_type import addType
from mods.views.get_type import getType
from mods.views.get_mod import getMod
from mods.views.add_module_result import addModuleResult
from mods.views.insert_data import insertData
from mods.views.show import showPage,showPageByType,showPageByLayoutType,showDetail
from mods.views.page import createPage,layoutList,savePage

urlpatterns = patterns('',
    #url(r'^deletelog/(?P<logId>\d+)/$', deleteLog),
    url(r'^$', showPage),
    #构建页面
    url(r'^create_page$', createPage),
    #组件详情
    url(r'^detail/(?P<mod_id>\d+)/$',showDetail),
    #列出某一类型的布局组件
    url(r'^layout_list$', layoutList),
    #根据组件类型列出相应的组件
    url(r'^type/(?P<type_id>\d+)$', showPageByType),
    #根据组件支持的布局位列出相应组件
    url(r'^layout_type/(?P<layout_type>.+)$', showPageByLayoutType),
    #保存组件
    url(r'^save_page$', savePage),
    #新增组件
    url(r'^add_mod$', addModule),
    url(r'^addModuleResult', addModuleResult),
    #修改组件
    url(r'^update_mod/(?P<update_mod_id>\d+)/$', updateModule),
    url(r'^updateModuleResult', updateModuleResult),
    url(r'^add_type$', addType),
    #删除组件
    #url('r^delete_mod/()/$', deleteModule),
    #获取组件信息接口
    url(r'^get_type$', getType),
    url(r'^get_mod$', getMod),
    url(r'^insert_data', insertData),
   
)

