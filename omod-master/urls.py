from django.conf.urls.defaults import patterns, include, url
from django.conf import settings

urlpatterns = patterns('',
    url(r'^omod/', include("mods.urls")),
     #static files
    url(r'^omod/media/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT}),
)
