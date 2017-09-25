module.exports = {
    closeKey: 'tooltip@close',
    init:function(page){
        if(!page)return;
        var _this = this;
        page.tooltipClose = function(){
            page.setData({
                tooltip:{
                    show: false
                }
            });
            wx.setStorage({
                key: _this.closeKey,
                data:true
            })
        }
    }
}
