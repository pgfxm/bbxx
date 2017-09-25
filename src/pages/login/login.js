var app = getApp()
var toast = require('../../template/toast/index.js');
var util = require("../../utils/util.js");
Page({
  scopeData:{
    username:'',
    password: ''
  },
  data: {
    toast:{
      show: false,
      isMask: false,
      content: ''
    }
  },

  onLoad:function () {
  },

  onPullDownRefresh:function () {
    wx.stopPullDownRefresh()
  },

  updateData: function (e) {
    var key = e.currentTarget.dataset.key;
    this.scopeData[key] = e.detail.value || '';
  },

  doLogin:function(e) {
    var self = this;
    if(!this.scopeData.username || !this.scopeData.password){
      toast.show(this,'请输入你的帐号或密码');
      return;
    }
    util.request({
      url : app.globalData.domain.request+"/wx.php?m=weapp&act=login",
      data : {
        username : self.scopeData.username,
        password : self.scopeData.password
      },
      success : function(res){
        //这里需要将proxy的接口数据进行过滤 再次检测实际接口的数据
        util.checkAjaxResult({
          data : res.data,
          success : function(rt){
            if(rt.result){
              var login = require("../../modules/login/index.js");
              app.globalData.userInfo = rt.result;
              //绑定过 直接取信息 走人
              login.setLoginInfo(rt.result);
              wx.loginSuccess();
            }else{
              toast.show(self,rt.status.status_reason||'登录失败');
            }
          }
        });
      },
      fail : function(){
        toast.show(self,'登录失败');
      }
    });
  }
})
