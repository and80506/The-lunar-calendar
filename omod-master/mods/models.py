#coding: utf-8
from django.db import models


# 组件类型
class ModType(models.Model):
    # 类型描述
    name = models.CharField(max_length=200)
       
    class Meta:
        #自定义表名
        db_table = 'mod_type'


# 组件
class Mod(models.Model):
    # 组件描述
    name = models.CharField(max_length=200)
    # 组件缩略图
    img_thumb = models.URLField()
    # 组件所属类型
    type = models.ForeignKey(ModType)
    # HTML模板代码
    html_tpl_str = models.TextField()
    # 示例JSON数据 
    demo_json_str = models.TextField()
    # 最后修改时间
    last_modified_time = models.DateTimeField(auto_now=True)
    # 是否已审核
    is_online =  models.BooleanField()
    
    class Meta:
        #自定义表名   
        db_table = 'mod'

# 组件依赖的JS列表
class ModJSRequire(models.Model):
    # 组件
    mod = models.ForeignKey(Mod)
    # 脚本地址
    url = models.URLField()
    # 载入顺序
    index = models.IntegerField()

    class Meta:
        #自定义表名   
        db_table = 'mod_js_require'

# 组件依赖的JS列表
class ModCSSRequire(models.Model):
    # 组件
    mod = models.ForeignKey(Mod)
    # 样式表地址
    url = models.URLField()
    # 载入顺序
    index = models.IntegerField()

    class Meta:
        #自定义表名   
        db_table = 'mod_css_require'

# 组件支持的布局位
class ModLayoutSupport(models.Model):
    C1_MAIN = 'CM1'
    C2_MAIN = 'CM2'
    C3_MAIN = 'CM3'
    SUB     = 'SUB'
    EXTRA   = 'EXT'
    LAYOUT_SUPPORT_TYPE = (
        (C1_MAIN, '通栏布局主区块'),
        (C2_MAIN, '两栏布局主区块'),
        (C3_MAIN, '三栏布局主区块'),
        (SUB, '做测边栏区块'),
        (EXTRA, '右侧扩展侧边栏区块'),
    )
    # 组件对象
    mod = models.ForeignKey(Mod)
    # 样式表地址
    layout_type = models.CharField( max_length=3, choices=LAYOUT_SUPPORT_TYPE )

    class Meta:
        #自定义表名   
        db_table = 'mod_layout_support'

#附件
class attach(models.Model):
    file_name = models.CharField(max_length=100)            #文件名
    file_type = models.CharField(max_length=128)            #文件类型
    file_path = models.CharField(max_length=100)            #文件路径
    upload_date = models.DateTimeField(auto_now=True)       #上传时间
    class Meta:
        #自定义表名   
        db_table = 'attach'

