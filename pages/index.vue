<template>
  <div>
    <div class="canvasWrap" ref="canvasContainerRef">
      <canvas id="canvas"></canvas>
      <button class="fullscreen-btn" @click="toggleFullScreen">
        <span v-if="!isFullscreen">Fullscreen</span>
        <span v-else>Exit Fullscreen</span>
      </button>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { TimelineMax, Power1 } from 'gsap';
import jQuery from 'jquery';

const isFullscreen = ref(false);
const canvasContainerRef = ref(null);

// Variables we'll need to access across functions
let windowW, windowH;
let canvas, newcanvas;

// Toggle fullscreen function
const toggleFullScreen = () => {
  const container = canvasContainerRef.value;
  
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

// Handle fullscreen change
const handleFullscreenChange = () => {
  isFullscreen.value = Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
  
  setTimeout(() => {
    // Update dimensions
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    
    if (canvas && newcanvas) {
      setCanvasSize(canvas);
      setCanvasSize(newcanvas);
    }
  }, 100);
};

// Set canvas size
const setCanvasSize = (canvas) => {
  canvas.width = windowW;
  canvas.height = windowH;
  jQuery(canvas).css({
    'width': `${windowW}px`,
    'height': `${windowH}px`
  });
};

onMounted(() => {
  let settings = {};
  settings.cols = 20;
  settings.rows = 20;
  canvas = jQuery('#canvas')[0];
  let context = canvas.getContext('2d');
  let toggle1 = jQuery('#image1')[0];
  let toggle2 = jQuery('#image2')[0];
  let image1 = jQuery('#image1')[0];
  let image2 = jQuery('#image2')[0];
  let image3 = jQuery('#image3')[0];
  let image4 = jQuery('#image4')[0];
  newcanvas = jQuery('<canvas></canvas>')[0];
  let newcontext = newcanvas.getContext('2d');
  let state = {pos:0};
  let xw, xh, delay;
  windowW = jQuery(window).width();
  windowH = window.innerHeight;

  let tl = new TimelineMax();
  const autoplay = 4000;

  // Add fullscreen event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  function clamp(min, mid, max) {
    return mid < min ? min : mid < max ? mid : max;
  }
  
  // Initial canvas sizing
  setCanvasSize(canvas);
  setCanvasSize(newcanvas);

  // Handle window resize
  window.addEventListener('resize', () => {
    if (!isFullscreen.value) {
      windowW = jQuery(window).width();
      windowH = window.innerHeight;
      setCanvasSize(canvas);
      setCanvasSize(newcanvas);
    }
  });

  // Render temporary canvas (for transition effect)
  function RenderTempCanvas() {
    newcontext.clearRect(0, 0, windowW, windowH);
    newcontext.drawImage(toggle2, 0, 0, windowW, windowH);
    xw = windowW / settings.cols;
    xh = windowH / settings.rows;
    for (var i = 0; i <= settings.cols; i++) {
      for (var j = 0; j <= settings.rows; j++) {
        delay = (j * i) / (settings.cols * settings.rows);
        newcontext.clearRect(i * xw, j * xh, xw * clamp(state.pos - delay, 0, 1), xh * clamp(state.pos - delay, 0, 1));
      }
    }
  }

  // Render main canvas
  function render(imageT) {
    context.clearRect(0, 0, windowW, windowH);
    context.drawImage(imageT, 0, 0, windowW, windowH);
    RenderTempCanvas();
    context.drawImage(newcanvas, 0, 0);
  }

  // Animation loop
  function draw() {
    render(toggle1);
    window.requestAnimationFrame(draw);
  }

  draw();

  // Auto-slide timer
  const sliderInterval = setInterval(() => {
    Toggle();
  }, autoplay);

  // Store for cleanup
  window.sliderIntervalId = sliderInterval;

  // Toggle between slides
  function Toggle() {
    if (jQuery('.caption.show').is(':last-child')) {
      jQuery('.caption.show').removeClass('show');
      jQuery('.captions .caption:first-child').addClass('show');
    } else {
      jQuery('.caption.show').removeClass('show').next().addClass('show');
    }

    if (state.pos === 2) {
      tl.to(state, 2, {pos: 0, ease: Power1.easeOut});
    } else {
      tl.to(state, 2, {pos: 2, ease: Power1.easeOut});
    }

    if (jQuery('#image2').hasClass('active')) {
      jQuery('#image2').removeClass('active');
      jQuery('#image3').addClass('active');
      toggle1 = image3;
    } else if (jQuery('#image3').hasClass('active')) {
      jQuery('#image3').removeClass('active');
      jQuery('#image4').addClass('active');
      toggle2 = image4;
    } else if (jQuery('#image4').hasClass('active')) {
      jQuery('#image4').removeClass('active');
      jQuery('#image1').addClass('active');
      toggle1 = image1;
    } else if (jQuery('#image1').hasClass('active')) {
      jQuery('#image1').removeClass('active');
      jQuery('#image2').addClass('active');
      toggle2 = image2;
    }
  }
});

onUnmounted(() => {
  // Clean up interval
  if (window.sliderIntervalId) {
    clearInterval(window.sliderIntervalId);
  }
  
  // Remove event listeners
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});
</script>

<style lang="scss" scoped>
.canvasWrap {
  position: relative;	
  overflow: hidden;
  width: 100%;
  height: 100vh;
}

.images {
  display: none;
}

.fullscreen-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
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

/* Fullscreen mode styling */
:fullscreen,
:-webkit-full-screen,
:-moz-full-screen,
:-ms-fullscreen {
  margin: 0;
  padding: 0;
}

:fullscreen .canvasWrap,
:-webkit-full-screen .canvasWrap,
:-moz-full-screen .canvasWrap,
:-ms-fullscreen .canvasWrap {
  margin: 0;
  padding: 0;
  width: 100% !important;
  height: 100% !important;
}

:fullscreen canvas,
:-webkit-full-screen canvas,
:-moz-full-screen canvas,
:-ms-fullscreen canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>