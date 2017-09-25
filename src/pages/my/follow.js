var app = getApp();
var util = require("../../utils/util.js");
Page({
  scopeData:{
    pageNum:1,
    pageSize:100,
    hids:[]
  },
  data : {
    loadmore: {
      isLoading : false,//正在加载 则显示加载动画 同时触发底部不更新 加载完毕 设置为false
      hideOverTip : false,
      isOver : false//全部加载完毕
    },
    total:0,
    userInfo: {},
    isEmpty:false,
    list:[],
    errMsg: '加油，目前还没有人关注你哦'
  },
  onLoad: function(e){
    var login = require("../../modules/login/index.js");
    if(!login.isLogin()){
      var msg = '本页面功能需要你授权允许使用你微信个人资料才能访问哦';
      this.setData({
        isEmpty: true,
        errMsg: msg
      });
      return;
    }else{
      var userInfo = app.globalData.userInfo = login.getUserInfo();
      this.setData({
        userInfo: userInfo
      });
    }
    this.getList();
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
      url : app.globalData.domain.request+"/wx.php?m=weapp&act=GetFollow",
      data : {
        token: app.globalData.userInfo.token || '',
        id: app.globalData.userInfo.id || '',
        page : self.scopeData.pageNum,
        pageSize : self.scopeData.pageSize
      },
      complete : function(){
        var data = {
          "loadmore.isLoading" : false
        }
        if(!self.data.list.length){
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
              item,
              res = rt.result,
              length = res.length,
              total = rt.count,
              curPage = self.scopeData.pageNum;

            if(length){
              for(var i=0; i<length; i++){
                item = res[i];
                if(~self.scopeData.hids.indexOf(item.id)){//去除重复
                  continue;
                }
                self.scopeData.hids.push(item.id);
                self.data.list.push(item);
              }
              data = {
                list:self.data.list,
                total:total
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
                data.errMsg = '加油，目前还没有人关注你哦'
              }
            }

            self.setData(data);
          }
        });
      }
    });

  }
});