#coding: utf-8
from mods.models import Mod, ModType, ModJSRequire, ModCSSRequire, ModLayoutSupport
from django.shortcuts import HttpResponse, render_to_response, render
from django.http import HttpResponseRedirect
from django import template
import urllib2

def createPage(request):
    mod = Mod.objects.filter(type = 1)
    return render(request, 'create_page.html', {
                                                   'models' : {
                                                                       'mod' : mod,
                                                   }})
def layoutList(request):
    modIdQuery  = request.GET.get('modId')
    queryList = modIdQuery.split(',')
    if modIdQuery != None :
        mod = Mod.objects.filter(id__in = queryList)
    else :
        mod = Mod.objects.all()
    return render(request, 'layout_list.html', {
                                                   'models' : {
                                                                       'mod' : mod,
                                                   }})
def savePage(request):
    layout = request.POST.get('layout')
    layout =  urllib2.unquote(layout).decode("utf-8")
    
    print layout
    return render(request, 'layout.html',{
                                          'layout' : layout,
                                          })
  