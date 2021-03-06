//app.js
var scopeNotices = {},
    config = require('./config'),
    scopeVersion = '1.0.0';
var navigateTo = wx.navigateTo;
Object.defineProperty(wx, 'navigateTo', {
  get : function () {
    return function (params) {
      var pageStack = getCurrentPages();
      if(pageStack.length==5){
        console.log('navigateTo to redirectTo....');
        wx.redirectTo(params);
      }else{
        navigateTo(params);
      }
    }
  }
})

App({
    version: scopeVersion,

    onLaunch : function (e) {

        var _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.systemInfo = res;
                if(+res.version.replace('.','')>65){
                    _this.downloadInitImg();//缓存常用图片
                }
            }
        })
    },

    getNotices: function(page, action){//action 规定以__pna(pageNoticeAction)为前缀
        if(!page || !scopeNotices[page])return '';
        return action?scopeNotices[page][action]:scopeNotices[page];
    },

    postPageNotices: function(page, action, payload){
        if(!page || !action)return;
        if(!scopeNotices[page])scopeNotices[page] = {};
        scopeNotices[page][action] = payload || '';
    },

    removeNotices: function(page, action){
        if(page){
            if(action){
                scopeNotices[page][action] = null;
            }else{
                scopeNotices[page] = null;
            }
        }
    },

    dispatchNotices: function(page){//处理消息，一般在页面的onShow事件里调用
        //获取页面消息
        var pageObj = this.getNotices(page.name);
        if(pageObj){
            for(var method in pageObj){
                page['__pna'+method] && page['__pna'+method].call(page,pageObj[method]);
            }
            this.removeNotices(page.name);
        }
    },

    downloadInitImg : function(){
        //下载图片
        var _this = this,
            fileCache = require("./utils/fileCache");
        var cacheFile = function(name){
            fileCache.cacheFileToLocal({
                name:name,
                url:_this.globalData.commonImage[name],
                success:function(fileName){
                    _this.globalData.commonImage[name] = fileName;
                }
            });
        }

        var cacheImage = _this.globalData.commonImage;
        wx.getStorage({
            key: 'version',
            success: function(res) {
                var version = res.data;
                if(version != scopeVersion){
                    fileCache.removeCacheFiles();

                    for(var k in cacheImage){
                        (function(k){cacheFile(k);})(k);
                    }
                    wx.setStorage({
                        key:"version",
                        data:scopeVersion
                    })
                }else{
                    for(var k in cacheImage){
                        cacheImage[k] = fileCache.getCacheFilePath(k) || cacheImage[k];
                    }
                }
            }
        })
    },

    showAlert : function(options){
        if(typeof options!='object' || !options.content){
            return;
        }
        wx.showModal && wx.showModal({
            title: options.title || '提示',
            content: options.content,
            showCancel: options.showCancel || false,
            confirmText: options.confirmText || '确定',
            success: function(res) {
                if (res.confirm) {
                    options.confirmFun && options.confirmFun();
                }else{
                    options.cannelFun && options.cannelFun();
                }
            }
        })
    },

    globalData : config
});