// 轮播
function InitSlider(opts){
  var opts = opts || {};
  var options = {
    speed: 3000,
    autoSlide: true,
    container: '.banner',
    slideIndex: ''
  }

  $.extend(options,opts);

  var swiper_wrap = $(options.container +' .swiper_wrap');
  var slides = $('.wipe_img_con');
  var len = slides.length;
  var winWidth = $(window).width();
  var timer = null, cont_height = [],
      maxHeight = 0, index = 1,flag = 0, left = 0,swipeRt = false;

  slides.css({'width': winWidth});
  swiper_wrap.css({
    'width': winWidth*len,
    'left': '-'+winWidth+'px'
  });

  slides.each(function(i, slide) {
    cont_height.push($(slide).height());
  });

  maxHeight = Math.max.apply({},cont_height); //获取最大的高度作为banner的高度
  $(options.container).css({ height: maxHeight });
  
  // 开始动画
  function startAnimate(){
    timer = setInterval(function(){

      index++;

      left = index*winWidth;
      swiper_wrap.animate({
        left: '-'+ left+'px'
      },300,'ease-out',function(){
        if(index == len-1){
          swiper_wrap.css('left','0px');
          index = 1;
        }
      });

    },3000);
  }
  if(options.autoSlide){
    startAnimate();
  }

  function stopAnimate(){
    clearInterval(timer);
  }

  var startPosition,endPosition,originPosition;

  swiper_wrap.on('touchstart',function(e){
    clearInterval(timer);
    var touch = e.touches[0];
    startPosition = {
      x: touch.pageX
    }
     originPosition = {
      x: touch.pageX
    }

  });

  swiper_wrap.on('touchmove',function(e){
    var touch = e.touches[0];

    if(flag){
      startPosition.x = endPosition.x;
    }
    flag = 1;

    endPosition = {
      x: touch.pageX
    }
    swiper_wrap.css({
      left: parseInt(swiper_wrap.css('left')) + (endPosition.x - startPosition.x) +'px'
    });
  });

  swiper_wrap.on('touchend',function(e){

    swipeRt = endPosition.x - originPosition.x > 0 ? true:false;

    flag = 0;

    var toleft;

    if(swipeRt){
      index --;
      toleft = '-'+index*winWidth + 'px';
    }
    else{
      index++;
      toleft = '-'+index*winWidth + 'px'
    }

    swiper_wrap.animate({
      left: toleft
    },300,'ease-out',function(){

      if( !swipeRt && index == len-1){
        swiper_wrap.css('left', '-'+winWidth+'px');
        index = 1;
      }else if(swipeRt && index == 0){
        swiper_wrap.css({ 'left': '-'+winWidth*(len-2) +'px' });
        index = len-2;
      }
    $(options.slideIndex).html(index);
    });
    if(options.autoSlide){
      startAnimate();
    }

  });
}

// popup
function popup(params){
  var defaults = {
    pop: '.j-popup',
    openbtn: '.j-open',
    close: '.j-close'
  }

  this.params = $.extend(defaults, params);
  var self = this;

  function _init(){
    $(self.params.openbtn).on('tap',function(){
      var type = $(this).data('type');
      $(self.params.pop + ' .j-confirm').attr('data-type',type);
      self.open();
    });
    $(self.params.close).on('click',function(){
      self.close();
    });
    $(self.params.pop).on('click',function(e){
      if($(e.target).hasClass('mask')){
        self.close();
      }
    });
    $('.j-confirm').on('click',function(e){
      self.close();
    })
  }
  _init();
  
}
popup.prototype.open = function(){
  $(this.params.pop).show();
}
popup.prototype.close = function(){
  $(this.params.pop).hide();
}

// 弹窗
;(function($){
  Zepto.Modal = function(opts){
    var self = {
      modal: '.modal',
      height: 0,
      width: 0,
      _init: function(){
        var height = $(self.modal).height()
        var winHeight = window.innerHeight;
        if(self.width>0){
          $(self.modal).css({
            width: self.width + 'px',
            marginLeft: '-'+ self.width/2 + 'px'
          });
        }
        if(self.height>0){
          $(self.modal).css({
            height: self.height + 'px'
          })
        }
        // if(height-winHeight>=-30){
          $('body').css({
            position: 'relative'
          })
          $(self.modal).css({
            position: 'absolute',
            top: '-70px',
            marginBottom: '100px',
            transform: 'translateY(0)'
          })
        // }
      },
      open: function(){
        $(this.modal).css({top:$("body").scrollTop()+"px"});
        $(this.modal).fadeIn();
        $('<div class="mask"></div>').appendTo('body').fadeIn();
        // $('.j-modal-mask').fadeIn();
      },
      close: function(){
        $(this.modal).fadeOut();
        $('.mask').fadeOut();
        // $('.j-modal-mask').fadeOut();
      }
    };
    self = $.extend(self,opts);
    self._init();
    $(self.modal).find('.j-close').on('click',function(){
      self.close();
    });
    $('.j-modal-mask').on('click',function(){
      self.close();
    });
    return self;
  }
})(Zepto)

$(function(){
  $.config = { router: false }
  $.init();

  // qty operation
  function changeQTY(){
    $('.j-reduct').on('click',reduceNum);
    $('.j-add').on('click',addNum);
    function reduceNum(){
      var now = parseInt($('.j-num').html());
      if(now == 1) return;
      $('.j-num').html(--now);
    }
    function addNum(){
      var now = parseInt($('.j-num').html());
      $('.j-num').html(++now);
    }
  }
  changeQTY();
});