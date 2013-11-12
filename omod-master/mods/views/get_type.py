#coding: utf-8
from mods.models import ModType
from django.shortcuts import HttpResponse
from django.utils import simplejson

def getType(request):
    if request.method == "GET":
        jsonp = request.GET.get('jsonp')
        modTypes = ModType.objects.all()
        modTypeList = []
        for item in modTypes:
            modTypeList.append({
                            "id" : item.pk,
                            "name" : item.name
                        })
            
        JSONstr = simplejson.dumps( {
                                        "modTypeList" : modTypeList
                                    }, cls = simplejson.JSONEncoder )
        if jsonp is None:
            return HttpResponse(JSONstr, mimetype="application/json")
        else:
            return HttpResponse(jsonp + '(' + JSONstr + ')', mimetype="application/javascript")
    