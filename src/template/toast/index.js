module.exports = {
    show: function(page,content,duration){
        if(!page || !content)return;
        page.setData({
            toast:{
                show: true,
                content: content
            }
        });
        setTimeout(function(){
            page.setData({
                toast:{
                    show: false,
                    content: ''
                }
            });
        },duration || 2000);
    }
}
