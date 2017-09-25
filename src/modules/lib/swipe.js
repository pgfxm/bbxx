var mod = {
    startPos: [0,0],
    startTouch:function(e){
        if(!e)return;
        this.startPos = [e.pageX, e.pageY];
    },
    setCurPos:function(e)
    {
        if(!e)return;
        this.curPos = [e.pageX, e.pageY];
        this.calculateGap();
    },
    calculateGap: function(){
        this.gapX = this.curPos[0] - this.startPos[0];
        this.gapY = this.curPos[1] - this.startPos[1];
    }
};
module.exports = mod;