var mod = {
    cacheFileToLocal:function(param){//{name:'',url:'',success:''}
        if(param && param.name && param.url){
            wx.downloadFile({
                url : param.url,
                success : function(data){
                    wx.saveFile({
                        tempFilePath: data.tempFilePath,
                        success: function(res) {
                            wx.setStorageSync("_CACHE_"+param.name, res.savedFilePath);
                            if(typeof(param.success) == 'function'){
                                param.success.call(null,res.savedFilePath);
                            }
                        }
                    })
                },
                fail: function(e){
                    console.log(e);
                }
            });
        }
    },

    getCacheFilePath:function(name){
        return wx.getStorageSync("_CACHE_"+name);
    },

    removeCacheFiles:function(name){
        var _this = this;
        if(name){
            _this.removeCacheFileByName('_CACHE_'+res.keys[i]);
        }else{
            var keys = [];
            wx.getStorageInfo({
                success: function(res) {
                    var length = res.keys.length;
                    for(var i=0; i<length; i++){
                        if(res.keys[i].indexOf('_CACHE_')===0){
                            _this.removeCacheFileByName(res.keys[i]);
                        }
                    }
                }
            });
        }
    },

    removeCacheFileByName:function(name){//删除单个缓存文件
        wx.getStorage({
            key:name,
            success:function(res){
                wx.removeSavedFile({//删除对应文件
                    filePath: res.data,
                    success: function(res) {
                        wx.removeStorage({//删除对应storage
                            key: name,
                            success: function(res) {
                                console.log('del succ '+name);
                            }
                        });
                    }
                })
            }
        })
    }

}
module.exports = mod;