<template>
  <div>
    <div class="canvasWrap">
        <canvas id="canvas"></canvas>
    </div>

    <div class="images">
        <img width="200" id="image1" src="/assets/images/1.jpg" alt="">
        <img width="200" id="image2" class="active" src="/assets/images/2.jpg" alt="">
        <img width="200" id="image3" src="/assets/images/3.jpg" alt="">
        <img width="200" id="image4" src="/assets/images/4.jpg" alt="">
    </div>
  </div>
</template>

<script setup>
import { TimelineMax } from 'gsap'
onMounted(() => {
  let settings = {};
  settings.cols = 20;
  settings.rows = 20;
  let canvas =jQuery('#canvas')[0];
  let context = canvas.getContext('2d');
  let toggle1 = jQuery('#image1')[0];
  let toggle2 = jQuery('#image2')[0];
  let image1 = jQuery('#image1')[0];
  let image2 = jQuery('#image2')[0];
  let image3 = jQuery('#image3')[0];
  let image4 = jQuery('#image4')[0];
  let newcanvas = jQuery('<canvas></canvas>')[0];
  let newcontext = newcanvas.getContext('2d');
  let state = {pos:0};
  let xw,xh,delay;
  let windowW = $(window).width();
  let windowH = window.innerHeight;

  let tl = new TimelineMax();
  let scaleFrom = 1.2;

  var autoplay = 4000;

  function clamp(min,mid,max){
    return mid < min ? min : mid < max ? mid : max
  }
  function setCanvasSize(canvas) {
      canvas.width = windowW;
      canvas.height = windowH;    
      $(canvas).css('width', windowW);
      $(canvas).css('height', windowH);
  }

  setCanvasSize(canvas);
  setCanvasSize(newcanvas);

  function RenderTempCanvas() {
      newcontext.clearRect(0,0,windowW,windowH);
      newcontext.drawImage(toggle2, 0,0);
      xw = windowW/settings.cols;
      xh = windowH/settings.rows;
      for (var i = 0; i<=settings.cols; i++) {
          for (var j = 0; j<=settings.rows; j++) {
              delay = (j*i)/(settings.cols*settings.rows);
              newcontext.clearRect(i*xw,j*xh,xw*clamp(state.pos -delay,0,1),xh*clamp(state.pos - delay,0,1));
          }
      }
  }

  // function render(imageT) {
  //     context.clearRect(0,0,canvas.width, canvas.height);
  //     context.drawImage(imageT, 0,0);
  //     RenderTempCanvas();
  //     context.drawImage(newcanvas, 0,0);    
  // }
  function render(imageT) {
    context.clearRect(0, 0, windowW, windowH);

    const imgW = imageT.width;
    const imgH = imageT.height;
    const canvasW = windowW;
    const canvasH = windowH;

    // Calculate scale to fit image inside canvas
    const scale = Math.min(canvasW / imgW, canvasH / imgH);

    const scaledW = imgW * scale;
    const scaledH = imgH * scale;

    // const x = (canvasW - scaledW) / 2;
    // const y = (canvasH - scaledH) / 2;

    context.drawImage(imageT, 0, 0, windowW, windowH);

    RenderTempCanvas?.();
    context.drawImage(newcanvas, 0, 0);
  }




  function draw() {
      render(toggle1);
      window.requestAnimationFrame(draw);
  }

  draw();

  setInterval(function() {
      Toggle()
  }, autoplay);

  function Toggle(){
      if($('.caption.show').is(':last-child')) {
          $('.caption.show').removeClass('show');
          $('.captions .caption:first-child').addClass('show');
      } else {
          $('.caption.show').removeClass('show').next().addClass('show');
      }

      if(state.pos===2) {
          tl.to(state, 2, {pos: 0, ease: Power1.easeOut});
          //tl.fromTo(canvas, 3, {scale: scaleFrom}, {scale: 1, delay: -1.7,ease: Expo.easeOut} )
          //tl.to(newcanvas, 0, {scale: 1, delay: 1});
      } else{
          tl.to(state, 2, {pos: 2, ease: Power1.easeOut});
          //tl.fromTo(canvas, 3, {scale: scaleFrom}, {scale: 1, delay: -1.7,ease: Expo.easeOut} )
          //tl.to(canvas, 0, {scale: 1, delay: 1});        
      }

      if($('#image2').hasClass('active')) {
          $('#image2').removeClass('active');
          $('#image3').addClass('active');
          toggle1 = image3;
      } else if($('#image3').hasClass('active')) {
          $('#image3').removeClass('active');
          $('#image4').addClass('active');
          toggle2 = image4;
      } else if($('#image4').hasClass('active')) {
          $('#image4').removeClass('active');
          $('#image1').addClass('active');
          toggle1 = image1;
      } else if($('#image1').hasClass('active')) {
          $('#image1').removeClass('active');
          $('#image2').addClass('active');
          toggle2 = image2;
      }
  }
})

</script>

<style lang="scss" scoped>

.canvasWrap {
	position: relative;	
	overflow: hidden;
}

.images {
	display: none;
}

.header {
	position: absolute;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 20;
	padding: 50px 5%;
	p {
		font-size: 30px;
		font-weight: bold;
	}
}

</style>
