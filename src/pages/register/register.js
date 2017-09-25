var app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {
  },

  onLoad:function () {
  },

  onPullDownRefresh:function () {
    wx.stopPullDownRefresh()
  },

  formSubmit:function(e) {
    console.log(e)
    const value = e.detail.value
    const pwd = value.password
    const confirmPassword = value.confirmPassword
    const email =  value.email
    if(pwd && pwd !== confirmPassword) {
      console.log('TODO: check pwd length')
      app.showAlert({content:'输入的密码不一致'})
    } else if (!email || !(util.checkPhone(email) || util.checkMain(email))) {
      app.showAlert({content:'请输入邮箱或手机号'})
    } else {
      wx.request({
        url: '',
        data: {
          name: name,
          password: pwd
        },
        method: 'POST',
        complete: function (rt) {
        },
        success: function (data) {

        },
        fail: function (e) {
          util.showModal('注册失败')
        }
      })
    }
  }
})
