#coding: utf-8

from django.shortcuts import HttpResponse
from mods.models import ModType
from mods.models import Mod
from mods.models import ModLayoutSupport
from django.core.exceptions import ValidationError
from django import forms
import re

def valiLowercaseAndUnderline(value):
    reg = re.compile('[^a-z0-9_]', re.DOTALL)
    if reg.match(value) != None:
        raise ValidationError(u'%s 不是由小写字母、数字、下划线组成 ' % value)

class addTypeForm(forms.Form):
    # 类型描述
    name = forms.CharField(
                           required = True,
                           max_length = 200,
                           error_messages = {"required" : "类型描述不能为空!", "invalid" : ""}
                            )
    # 目录名
    type_dir = forms.CharField(
                           required = True,
                           max_length = 200,
                           validators = [valiLowercaseAndUnderline],
                           error_messages = {"required" : "目录名不能为空!", "invalid" : "目录名只能由小写字母、数字、下划线组成"}
                           )





def addType(request):
    if request.method == "GET":
        # 填充组件类型表
        if ModType.objects.count() == 0:
            ModType(name="布局").save()
            ModType(name="产品列表").save()
            ModType(name="导航条").save()
            ModType(name="标题栏").save()
            ModType(name="类目或关键词导航").save()
            ModType(name="其他").save()
            
        #
        # Insert代码生成脚本:
        #
        # (function(resStr, mods, o){
        #     mods = omodManager.getModList();
        #     for(var i=0,l=mods.length;i<l;i++) {
        #         o = mods[i];
        #         resStr.push('Mod(name="' + o.name + '", img_thumb="' + o.imgThumb + '", type=ModType.objects.get(name="' + o.type.name + '")[0], html_tpl_str="' + o.templateFilePath + '", demo_json_str="' + o.demoJSONFilePath + '").save()');
        #     }
        #     console.log(resStr.join('\n'));
        # })([]);
        # 
        # 填充组件表
        if Mod.objects.count() == 0:
            Mod(name="Weekend Deals 顶部主推产品", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb1.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/wd-tp.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/wd-tp.json.htm").save()
            Mod(name="纯灰底，白色字", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/nav_list.jpg", type=ModType.objects.get(name="导航条"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/nav-bar/gb-wl.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/nav-bar/gb-wl.json.htm").save()
            Mod(name="VIFrame 经典导航条", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/nav_trumb1.jpg", type=ModType.objects.get(name="导航条"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/nav-bar/vif-classic.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/nav-bar/vif-classic.json.htm").save()
            Mod(name="VIFrame经典标题栏", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/title_trumb.jpg", type=ModType.objects.get(name="标题栏"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/title-bar/vif-classic.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/title-bar/vif-classic.json.htm").save()
            Mod(name="页面右侧悬浮导航条", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/home_banner/2012/08/dhl/design/20120824160141.png", type=ModType.objects.get(name="导航条"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/nav-bar/fixed-rb.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/nav-bar/fixed-rb.json.htm").save()
            Mod(name="3像素灰色粗底线版标题栏", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/title_trumb1.jpg", type=ModType.objects.get(name="标题栏"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/title-bar/b-3px.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/title-bar/b-3px.json.htm").save()
            Mod(name="瀑布流，灰边框，4列产品 ", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb2.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/gb-4r-s.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/gb-4r-s.json.htm").save()
            Mod(name="瀑布流，灰边框，5列产品", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb3.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/gb-5r-s.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/gb-5r-s.json.htm").save()
            Mod(name="灰边框，一行5个产品 - (4个时omod-p-list-gb-5r换成omod-p-list-gb-4r)", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb4.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/gb-5r.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/gb-5r.json.htm").save()
            Mod(name="灰网格，一行5个产品-(数字不一样时修改HTML的class属性里面的数字)", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb5.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/gt-5r.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/gt-5r.json.htm").save()
            Mod(name="左侧产品详情，右侧一大2小图片", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb6.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/l-list-r-3p.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/l-list-r-3p.json.htm").save()
            Mod(name="左侧大图，右侧四个产品列表", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb11.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/rig-four-list.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/rig-four-list.json.htm").save()
            Mod(name="左右箭头切换滚动,（切换到750添加class的属性\"omod-p-list-gs-3r-roll-750\"）", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb7.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/gs-3r-roll.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/gs-3r-roll.json.htm").save()
            Mod(name="右侧为一个大的产品类目，左侧为3个小的产品", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb8.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/g-4r-3s.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/g-4r-3s.json.htm").save()
            Mod(name="右侧为一个大的产品类目，左侧为8个小的产品", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb9.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/g-9r-8s.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/g-9r-8s.json.htm").save()
            Mod(name="左侧类目导航，二级类目、可折叠", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/menu_trumb1.jpg", type=ModType.objects.get(name="类目或关键词导航"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/cate-nav/vif-cate-list.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/cate-nav/vif-cate-list.json.htm").save()
            Mod(name="左侧类目导航，二级类目、不可折叠", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/menu_trumb2.jpg", type=ModType.objects.get(name="类目或关键词导航"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/cate-nav/l-2-cate-list.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/cate-nav/l-2-cate-list.json.htm").save()
            Mod(name="左右切换、点击放大、一行5个产品", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb10.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/swi-big-5r.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/swi-big-5r.json.htm").save()
            Mod(name="热搜关键词样式", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list.jpg", type=ModType.objects.get(name="类目或关键词导航"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/cate-nav/pop-search.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/cate-nav/pop-search.json.htm").save()
            Mod(name="无边框、侧边、流布局产品列表", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/list_trumb12.jpg", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/nob-side-p-list.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/nob-side-p-list.json.htm").save()
            Mod(name="上面产品大图，下面产品缩略图，点击缩略图大图切换，缩略图可左右切换", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/trumb_list13.png", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/abbre-big-roll.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/abbre-big-roll.json.htm").save()
            Mod(name="频道树形类目导航", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/nav_list1.jpg", type=ModType.objects.get(name="类目或关键词导航"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/cate-nav/tree-cate-nav.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/cate-nav/tree-cate-nav.json.htm").save()
            Mod(name="SNS分享", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/sns_trumb.png", type=ModType.objects.get(name="其他"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/other/sns-share.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/other/sns-share.json.htm").save()
            Mod(name="左右箭头旋转切换", img_thumb="http://img.alibaba.com/images/cms/upload/wholesale/activities/trumb_list15.png", type=ModType.objects.get(name="产品列表"), html_tpl_str="http://styleshit.me/demo/o-mod/templates/p-list/carousel.html", demo_json_str="http://styleshit.me/demo/o-mod/templates/p-list/carousel.json.htm").save()

        if ModLayoutSupport.objects.count() == 0:
            ModLayoutSupport(mod=Mod.objects.get(pk=1), layout_type='CM1').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=2), layout_type='CM1').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=2), layout_type='CM2').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=2), layout_type='CM3').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=3), layout_type='CM1').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=3), layout_type='CM2').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=3), layout_type='CM3').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=4), layout_type='CM1').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=4), layout_type='CM2').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=4), layout_type='CM3').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=5), layout_type='EXT').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=6), layout_type='CM1').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=6), layout_type='CM2').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=6), layout_type='CM3').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=6), layout_type='SUB').save()
            ModLayoutSupport(mod=Mod.objects.get(pk=6), layout_type='EXT').save()
            
        return HttpResponse('ok')
        
