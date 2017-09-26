var app = getApp()
var toast = require('../../template/toast/index.js');
var util = require("../../utils/util.js");
Page({
  scopeData:{},
  data: {
    img:'',
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
    this.scopeData[key] = e.detail.value.replace(/^\s+|\s+$/,'') || '';
  },

  copyUrl: function () {
    var url = 'https://wxshow.vipsinaapp.com/bbxx/';
    wx.setClipboardData({
      data: url,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制地址成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  setPwd:function(e) {
    var self = this;
    if(!this.scopeData.password){
      toast.show(this,'请输入你的密码');
      return;
    }
    if(this.scopeData.password!=this.scopeData.rpassword){
      toast.show(this,'两次密码不一致');
      return;
    }
    util.request({
      url : app.globalData.domain.request+"/wx.php?m=weapp&act=updatePwd",
      data : {
        token: app.globalData.userInfo.token || '',
        password : self.scopeData.password
      },
      success : function(res){
        //这里需要将proxy的接口数据进行过滤 再次检测实际接口的数据
        util.checkAjaxResult({
          data : res.data,
          success : function(rt){
            if(rt.result){
              wx.showToast({
                title: '设置成功',
                icon: 'loading',
                duration: 2500,
                success:function (rt) {
                  wx.navigateBack()
                }
              });
            }else{
              toast.show(self,rt.status.status_reason||'操作失败');
            }
          }
        });
      },
      fail : function(){
        toast.show(self,'操作失败');
      }
    });
  }
})
