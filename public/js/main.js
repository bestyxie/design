// $(function(){

  // 轮播

  window.onload = function(){

    function initSlider(){
      var swiper_wrap = $('.swiper_wrap');
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
      $('.banner').css({ height: maxHeight });
      
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
      // startAnimate();

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
        });

        startAnimate();
      })
    }
    initSlider();

  }

// });