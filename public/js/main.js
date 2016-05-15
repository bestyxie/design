$(function(){

  function initSlider(){
    var swiper_wrap = $('.swiper_wrap');
    var slides = $('.wipe_img_con');
    var winWidth = $(window).width();
    var timer = null;

    slides.css({'width': winWidth});
    swiper_wrap.css({'width': winWidth*slides.length});

    timer = setInterval(function(){
      
    },3000);
  }
  initSlider();


});