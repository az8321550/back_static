function slider(){}
slider.prototype.init=function(){
    this.width=$(".tag-nav").width();
    this.index=0;
    var tempwidth=0;
    $(".nav-tabs>li").each(function(){
        tempwidth+=$(this).width();
    })
    this.last=Math.ceil(tempwidth/this.width)-1;
}
slider.prototype.bind=function(){
    var _this=this;
    $(".tag-nav-left").click(function () {
        if(_this.index==0){
            return false;
        }
        _this.index--;
        $(".tag-nav-con").animate({"left":-_this.width*_this.index});
    })
    $(".tag-nav-right").click(function () {
        if(_this.index==_this.last){
            return false;
        }
        _this.index++;
        $(".tag-nav-con").animate({"left":-_this.width*_this.index});
    })
}
slider.prototype.go=function(){
    this.init();
    this.bind();
}
new slider().go()