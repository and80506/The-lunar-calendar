#coding=utf-8
import os
import time
import md5
from settings import FILE_UPLOAD_PATH
from mods.models import attach

'''
使用方法
attach = request.FILES.get('files', None);
Upload().saveAttach([attach])
'''

class Upload:
    def __init__(self):
        self.basePath = FILE_UPLOAD_PATH
        year = time.strftime("%Y", time.localtime(time.time()))
        month = time.strftime("%m", time.localtime(time.time()))
        
        if(not os.path.exists(self.basePath)):
            os.mkdir(self.basePath)
            
        newPath = self.basePath +'/'+ year
        self.tablePath = year
            
        if(not os.path.exists(newPath)):
            os.mkdir(newPath)
            
        newPath += "/" + month
        
        self.tablePath += "/" + month
        
        if(not os.path.exists(newPath)):
            os.mkdir(newPath)
        
        self.newPath = newPath

            
            
    ##保存上传的附件
    def saveAttach(self, attach=[]):
        recordIds = []
        for att in attach:
            if(hasattr(att, "name") and not att.name == ""):
                uploaddate = time.strftime("%Y-%m-%d %X", time.localtime(time.time()))
                filename = md5.new(att.name + str(time.time())).hexdigest()
                oldfilename = att.name
                extname = att.name.split(".").pop()
                filetype = att.content_type
                
                savepath = self.newPath + "/" + filename + "." + extname
                self.tablePath = self.tablePath + "/" + filename + "." + extname
                
                hand = open(savepath, "wb")
                hand.write(att.file.read())
                hand.close()
                
                recordId = self.addRecord(oldfilename, filetype, uploaddate)
                
                recordIds.append(recordId)
                 
        return {
                'attachId' : recordIds,
                'file_path' : self.tablePath
                }
    
        
    ##插入记录 
    def addRecord(self, filename, filetype, uploaddate):
        att = attach(
                     file_name = filename,
                     file_type = filetype,
                     file_path = self.tablePath,
                     upload_date = uploaddate
                    )
        att.save()
        
        return att.id