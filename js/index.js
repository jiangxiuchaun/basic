var painter,initWidth=640,initHeight=1010,
  utils = {
    click: "ontouchstart" in document ? "touchstart": "mousedown",
    //是否存在指定函数 
    isFunction: function(funcName) {
      try {
        if (typeof(eval(funcName)) == "function") {
          return true;
        }
      } catch (e) {}
      return false;
    },
    loading:function(){
      if($('#utilsLoading').length==0){
        $('body').append('<div class="loadingMask" id="utilsLoading"><img src="./imgs/loading.gif" /></div>');
      }
      $('#utilsLoading').show();
    },
    hideLoading:function(){
      $('#utilsLoading').hide();
    },
    showTips: function(text,callback) {
      $("#inputTips p").text(text);
      $('#inputTips').css({
        display: 'block',
        bottom: -30
      }).transition({
        bottom: '50%'
      }, 500, 'ease-in', function() {
        $(this).transition({
          delay: 1000,
          bottom: '100%'
        }, 500, 'ease-out',function(){
           setTimeout(function(){
            if(callback)callback();
           },500)
        });
      })
    },
    showTips: function(text) {
      $("#inputTips p").text(text);
      $('#inputTips').css({
        display: 'block',
        bottom: -30
      }).transition({
        bottom: '50%'
      }, 500, 'ease-in', function() {
        $(this).transition({
          delay: 1000,
          bottom: '100%'
        }, 500, 'ease-out');
      })
    },
    playAudio:function(id,src) {
        var audio = $('#'+id);
        if (audio.attr('src') == undefined) {
            audio.attr('src', src);
        }
        audio[0].play();
    },
    isphone: function(v) {
      var a = /^1[3|4|5|7|8]\d{9}$/;
      var c = v.match(a);
      if (toString.call(c) == "[object Array]") {
        return c[0];
      } else {
        return false;
      }
    },
    random: function(start, end) {
      var params = arguments,
        random = Math.random();
      if (params.length < 2) {
        return random;
      }
      return start + Math.round((end - start) * random);
    }
  };
function paintClass() {
     this.startLoading();
}
paintClass.prototype = {
  startLoading: function() {
    var that = this;
    var loadAsset = new loader('#asset');
    loadAsset.onLoading = function(pf) {
      var percent = Math.floor(pf * 100);
      if (percent < 100) {
         $('#pertage').html(percent+'%');
      }
      if (percent >= 100) {
        $('#pertage').html(percent+'%');
        $('[imgSrc]').each(function(idx, item) {
          $(item).attr('src', $(item).attr('imgSrc'));
        })
        $('[bgSrc]').each(function(idx, item) {
            $(item).css({
                  'background-image': 'url('+$(item).attr('bgSrc')+')',
                  'background-size': '100% 100%'
            })
        })
        that.loadSuccess();
      }
    }
    loadAsset.load();
  },
  loadSuccess: function() {
  var that = this;
    $("#preload").transition({
      opacity: 0,
    }, 1000, 'ease-out', function() {
      $("#preload").remove();
    });
    that.imgSwiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      effect : 'fade',
      pagination: '.swiper-pagination',
      mousewheelControl: true,
      onInit: function(swiper) {
        swiperAnimateCache(swiper); //隐藏动画元素 
        swiperChange(swiper);
        swiperAnimate(swiper); //初始化完成开始动画
      },
      onSlideChangeEnd: function(swiper) {
        swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
      },
      onTransitionEnd: function(swiper) {
        swiperAnimate(swiper);
        swiperChange(swiper);
      },
      watchSlidesProgress: true,
      onProgress: function(swiper, progress) {
            for (var i = 0; i < swiper.slides.length; i++) {
                var slide = swiper.slides[i];
                var progress = slide.progress;
                var translate = progress * swiper.height / 4;
                scale = 1 - Math.min(Math.abs(progress * 0.5), 1);
                var opacity = 1 - Math.min(Math.abs(progress / 2), 0.5);
                slide.style.opacity = opacity;
                es = slide.style;
                if (progress > 0 && progress < 1) {
                    $(slide).css({
                        transformOrigin: "50% 100%",
                        transform: 'rotateX(' + 90 * progress + 'deg)',
                        //scale: 1 - progress
                    })
                } else {
                    $(slide).css({
                        transform: 'rotateX(0deg)',
                        //scale: 1
                    })
                }
            }
        },
    });
    //utils.playAudio('music','imgs/music.mp3');
    that.eventBind();
  },
  slideToPage: function(number) {
    var activeIndex = this.imgSwiper.activeIndex;
    var nextIndex = isNaN(number) ? activeIndex + 1 : parseInt(number);
    this.imgSwiper.slideTo(nextIndex);
    $('.swiper-slide:eq(' + this.imgSwiper.activeIndex + ')').css('zIndex', this.slideIndex++);
  },
  eventBind: function() {
    var that = this;
    $('#musicBtn').click(function(){
      var audio=$('#music').get(0);
      if(audio.paused){
        $(this).addClass('play');
        audio.play()
      }else{
        $(this).removeClass('play');
        audio.pause()
      }
    });
  },
  aniMation:function(args){
    var that=this,
        id=args.id,
        el=args.el,
        type=args.type,
        duration=args.duration?args.duration:'1s',
        delay=args.delay?args.delay:'0s',
        callback=args.callback?args.callback:null;
        var item=id?$('#'+id):$(el);
    item.css({display:'block','-webkit-animation-duration':duration,'-webkit-animation-delay':delay}).addClass(type + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass(type + ' animated');
      if(callback){
        callback.call(that,this);
        callback=null;
      }
    });
  }
}

$(function() {
  var clientWidth=document.body.clientWidth;
  var clientHeight=document.body.clientHeight;
  var ws = clientWidth / initWidth,
      hs = clientHeight / initHeight,
      real = ws > hs ? hs : ws;
  $('.resize').each(function(index, item) {
      $(item).css({
        width: parseInt(item.style.width) * ws + 'px',
        height: parseInt(item.style.height) * hs + 'px',
        left: parseInt(item.style.left) * ws + 'px',
        right: parseInt(item.style.right) * ws + 'px',
        top: parseInt(item.style.top) * hs + 'px',
        bottom: parseInt(item.style.bottom) * hs + 'px'
      });
  });
  /*================loading==========================*/
  painter = new paintClass();
})



var leftX=rightX='-'+document.body.clientWidth+'px';
var topY=bottomY='-'+document.body.clientHeight+'px';
function swiperChange(swiper) {
  var funcName = 'swiperAnimation' + swiper.activeIndex;
  if (utils.isFunction(funcName)) {
    eval(funcName).call();
  }
  var curIndex=parseInt(swiper.activeIndex);
  var prevIndex=curIndex-1;
  if(swiper.swipeDirection=="prev"){
      prevIndex=curIndex+1;
  }
  //$('#slide'+(prevIndex+1)+' .custom').hide();
  var funcOut = 'swiperOut'+prevIndex;
  if(utils.isFunction(funcOut)) {
    eval(funcOut).call();
  }
}
function swiperOut0(){
  
}
function swiperOut1(){
  
}

function swiperAnimation0(){  

}
/** swiper twice http://bbs.swiper.com.cn/forum.php?mod=viewthread&tid=328&page=1*/