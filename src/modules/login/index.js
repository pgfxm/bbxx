const storageKey = 'TOKEN_INFO';
var userLoginInfo = {},
    config = require('../../config'),
    util = require('../lib/util'),
    domain = config && config.domain.sso || 'https://wxshow.vipsinaapp.com';
var app = getApp();

wx.getStorage({
    key: storageKey,
    success: function(res) {
        userLoginInfo = res.data || {};
    }
});

var login = {
    storageKey: storageKey,
    config: {
        loginApi: domain +"/wx.php?m=weapp&act=login",
        loginCb:{
            complete: null,
            success: null
        },
    },

    getUserInfo: function(){
        if(userLoginInfo){
            if(!userLoginInfo.id){
              //userLoginInfo = wx.getStorageSync(storageKey);
              wx.getStorage({
                key: storageKey,
                success: function(res) {
                  userLoginInfo = res.data || {};
                }
              });
            }
        }else{
          userLoginInfo = {};
        }
        return userLoginInfo;
    },

    setLoginInfo: function(data){//登录后设置globalData和storage里的用户信息
        //写入本地缓存信息
        wx.setStorage({
            key: storageKey,
            data:data
        });
        userLoginInfo = data;
        this.config.loginCb.success && this.config.loginCb.success(data);
    },

    setConfig: function(config){
        this.getSystemInfo();
        if(config){
            util.extend(true, this.config, config);
        }
    },

    getSystemInfo: function(){
        this.systemInfo = app.systemInfo || wx.getSystemInfoSync();
        this.curSystem = this.systemInfo.system && this.systemInfo.system.split(' ')[0].toLowerCase();
    },

    isLogin: function(){
        this.getUserInfo();
        return !!userLoginInfo.id;
    },

    doLogin: function(){
        var _this = this;
        wx.login({
            success: function(res) {
                var code = res.code

                if(!code){
                    util.showModal("获取登录code失败");
                    return;
                }

                wx.getUserInfo({
                    success: function(res){
                        wx.request({
                            url : _this.config.loginApi,
                            data : {
                                code : code,
                                rawData : res.rawData,
                                signature : res.signature,
                                encryptData : res.encryptedData,
                                iv : res.iv,
                                wxid:'bbxx',
                                clientType: _this.curSystem
                            },
                            method : "GET",
                            complete : function(rt){
                                _this.config.loginCb.complete && _this.config.loginCb.complete(rt);
                            },
                            success : function(data){
                                //微信发起的请求成功
                                var data = data.data,
                                    statusCode = Number(data.status.status_code);
                                var rt = data.result;
                                if(statusCode === 0){//console.log('login rt',rt);
                                    rt = util.extend(rt,JSON.parse(res.rawData));//console.log('login userinfo',rt);
                                    app.globalData.userInfo = rt;
                                    //绑定过 直接取信息 走人
                                    _this.setLoginInfo(rt);

                                }else{
                                    util.showModal(data.status.status_reason);

                                }
                            },
                            fail : function(e){
                                util.showModal("登录失败");
                            }
                        });
                    },
                    fail : function(rt){
                        console.log(rt);
                        if(rt.errMsg.match(/cancel|deny/) || _this.grantFail === true){
                            _this.grantFail = rt.grantFail = true;
                            util.showModal({content:"由于你拒绝授权，用户信息无法获取，部分功能将不可用，请十分钟后再试"});
                        }else{
                            util.showModal("获取用户登录信息失败");
                        }
                        _this.config.loginCb.complete && _this.config.loginCb.complete(rt);
                    }
                });
            },
            fail : function(e){ 
                util.showModal("获取用户登录code失败");
                _this.config.loginCb.complete && _this.config.loginCb.complete(e);
            }
        });

    },
    
    doLogout: function(isBack,logoutCallback){
        //退出登录 应该清除掉所有缓存信息
        wx.clearStorage();
        util.resetUserInfo();
        userLoginInfo = {};
        app.globalData.userInfo = {};
        logoutCallback && logoutCallback();
        if(isBack!==false){
            wx.navigateBack({delta:getCurrentPages().length-1});
        }//到回首页
    }
}
module.exports = util.loginMod = login;
