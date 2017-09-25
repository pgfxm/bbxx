var app = getApp();
var toast = require('../../template/toast/index.js');
var util = require("../../utils/util.js");

Page({
  scopeData:{
    pageNum:1,
    pageSize:20,
    leftHeight:0,
    rightHeight:0,
    userId:'',//有值表示来自分享
    hids:[]
  },
  data : {
    toast:{
      show: false,
      isMask: false,
      content: ''
    },
    loadmore: {
      isLoading : false,//正在加载 则显示加载动画 同时触发底部不更新 加载完毕 设置为false
      hideOverTip : false,
      isOver : false//全部加载完毕
    },
    showFollow: false,
    collect: false,//是否已关注
    userInfo: {},
    isEmpty:false,
    leftList:[],
    rightList:[],
    errMsg: ''
  },

  onLoad: function(e){
    var userInfo,userid = e.userid || '';
    if(userid){
      this.scopeData.userId = userid;
      this.getUserInfo(userid);
    }else{
      var login = require("../../modules/login/index.js");
      if(!login.isLogin()){
        var msg = '本页面功能需要你授权允许使用你微信个人资料才能访问哦';
        this.setData({
          isEmpty: true,
          errMsg: msg
        });
        //login.doLogin();
        return;
      }else{
        userInfo = app.globalData.userInfo = login.getUserInfo();
        this.setData({
          userInfo: userInfo
        });
      }
    }

    this.getList();
  },

  getUserInfo: function(userid){
    var self = this;
    util.request({
      url : app.globalData.domain.request+"/wx.php?m=weapp&act=GetUserInfo",
      data : {
        token: app.globalData.userInfo.token || '',
        userid: userid
      },
      success : function(res){
        //这里需要将proxy的接口数据进行过滤 再次检测实际接口的数据
        util.checkAjaxResult({
          data : res.data,
          success : function(rt){
            var res = rt.result,
              collect = rt.collect;
            if(res){
              var showFollow = false;
              if(userid!=app.globalData.userInfo.id){
                showFollow = true;
                wx.setNavigationBarTitle({title:res.nickName+'的相册'});
              }
              self.setData({
                userInfo: res,
                showFollow: showFollow,
                collect:collect || false
              });
            }
          }
        });
      }
    });

  },
  getList: function(){
    var self = this;
    if(self.data.loadmore.isLoading || self.data.loadmore.isOver){
      return;
    }

    self.setData({
      "loadmore.isLoading" : true,
    });
    util.request({
      url : app.globalData.domain.request+"/wx.php?m=weapp&act=GetPhotoList",
      data : {
        token: app.globalData.userInfo.token || '',
        userid: this.scopeData.userId || app.globalData.userInfo.id || '',
        page : self.scopeData.pageNum,
        pageSize : self.scopeData.pageSize
      },
      complete : function(){
        var data = {
          "loadmore.isLoading" : false
        }
        if(!self.data.leftList.length){
          data.isEmpty = true;
        }
        self.setData(data);
      },
      success : function(res){
        //这里需要将proxy的接口数据进行过滤 再次检测实际接口的数据
        util.checkAjaxResult({
          data : res.data,
          success : function(rt){
            var data = {},
              item,imgInfo,
              res = rt.result.items,
              length = res.length,
              curPage = self.scopeData.pageNum;

            if(length){
              for(var i=0; i<length; i++){
                item = res[i];
                if(~self.scopeData.hids.indexOf(item.hid)){//去除重复
                  continue;
                }
                self.scopeData.hids.push(item.hid);
                imgInfo = item.src.match(/wh(\d+)x(\d+)\.\w+$/);
                if(self.scopeData.leftHeight<=self.scopeData.rightHeight){
                  self.data.leftList.push(item);
                  self.scopeData.leftHeight += Math.round(Number(imgInfo[2])/Number(imgInfo[1])*750);

                }else{
                  self.data.rightList.push(item);
                  self.scopeData.rightHeight += Math.round(Number(imgInfo[2])/Number(imgInfo[1])*750);
                }
              }
              data = {
                leftList : self.data.leftList,
                rightList : self.data.rightList
              };
              if(length < self.scopeData.pageSize){
                data.loadmore = {isOver:true};

                if(curPage < 2){
                  data.loadmore.hideOverTip = true//不足一页不显示“没有了”
                }else{
                  setTimeout(function(){
                    self.setData({
                      "loadmore.hideOverTip" : true
                    });
                  },3500);
                }
              }else{
                ++self.scopeData.pageNum;
              }
              data.errMsg = ''
            }
            else {
              data = {
                loadmore:{isOver : true}
              }
              if(curPage === 1){
                data.isEmpty = true;
                data.loadmore.hideOverTip = true;
                if(self.scopeData.userId){
                  data.errMsg = '他还没发布相册哦'
                }else{
                  data.errMsg = '赶紧上传你的第一个相册吧'
                }
              }
            }

            self.setData(data);
          }
        });
      }
    });

  },
  /**
   * 设置分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.userInfo.nickName+'的相册',
      desc: '可爱萌娃，不看后悔',
      path: '/pages/my/list?userid='+this.data.userInfo.id
    }
  },

  follow: function(e){
    if(this.data.collect){
      toast.show(this,'你已关注该用户了哦');
      return;
    }
    var self = this;
    util.request({
      showLoading: false,
      url : app.globalData.domain.request+"/wx.php?m=weapp&act=AddCollect",
      data : {
        token: app.globalData.userInfo.token || '',
        id: self.scopeData.userId
      },
      success : function(res){
        //这里需要将proxy的接口数据进行过滤 再次检测实际接口的数据
        util.checkAjaxResult({
          data : res.data,
          success : function(rt){
            toast.show(self,'关注成功');
            self.setData({
              collect:true
            });
          }
        });
      }
    });
  },

  goItem: function(e){
    var id = e.currentTarget.dataset.hid;
    wx.navigateTo({
      url:'/pages/item/index?id='+id
    });
  },

  onShow: function () {
    this.setData({
      loadmore : {isOver:false,isLoading:false}
    })
  }

});