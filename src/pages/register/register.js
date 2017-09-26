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
    this.scopeData[key] = e.detail.value || '';
  },

  addImg : function() {

    var _this = this;

    wx.chooseImage({
      count : 1,//当前最多可以选择的图片数量
      success : function(data){
        var upImgs = data.tempFilePaths;
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 10000
        });
        wx.uploadFile({
          url : app.globalData.domain.request+"/wx.php?m=weapp&act=Upload",
          filePath : upImgs[0],
          name : "file",
          complete : function(){
            console.log("--complete");
            wx.hideToast();
          },
          success : function(rt){
            console.log(rt);

            util.checkAjaxResult({
              data : JSON.parse(rt.data),
              success : function(data){

                _this.setData({
                  img:data.result
                })

              },
              error : function(data){
              }
            });
          },
          fail : function(err){
            console.log(err);
          }
        });

      },
      fail : function(err){
        console.log("fail");
        console.log(err);
      }
    });
  },

  imageLoadErr: function(e){

    var url = e.currentTarget.dataset.url;
    url = ~url.indexOf('?')?'&':'?'+'e';
    this.setData({
      img:url
    });
  },

  previewImg : function(e){
    var img = this.data.img;

    wx.previewImage({
      current : img,
      urls : [img]
    });
  },
  doReg:function(e) {
    var self = this;
    if(!this.scopeData.username || !this.scopeData.password){
      toast.show(this,'请输入你的帐号或密码');
      return;
    }
    if(this.scopeData.password!=this.scopeData.rpassword){
      toast.show(this,'两次密码不一致');
      return;
    }
    util.request({
      url : app.globalData.domain.request+"/wx.php?m=weapp&act=reg",
      data : {
        img : self.data.img,
        username : self.scopeData.username,
        password : self.scopeData.password
      },
      success : function(res){
        //这里需要将proxy的接口数据进行过滤 再次检测实际接口的数据
        util.checkAjaxResult({
          data : res.data,
          success : function(rt){
            if(rt.result){
              wx.showToast({
                title: '注册成功',
                icon: 'loading',
                duration: 2500,
                success:function (rt) {
                  wx.redirectTo({
                    url:'/pages/index/index'
                  })
                }
              });
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
