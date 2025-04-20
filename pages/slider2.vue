<template>
  <div>
    <h1>Swiper Slider</h1>
    <Swiper
      :modules="[EffectCreative, Autoplay]"
      effect="creative"
      :autoplay="{ delay: 4000 }"
      :loop="true"
      grab-cursor="true"
      class="mySwiper"
      :creative-effect="{
        prev: {
          shadow: true,
          translate: [0, 0, -400],
        },
        next: {
          // translate: [0, 0, '100%'],
          // rotate: [0, 0, 180],
          scale: 0.1,
          opacity: 0.1,
          shadow: true,
          origin: 'right top'
        },
      }"
    >
      <SwiperSlide v-for="(img, index) in images" :key="index">
        <img :src="img" class="w-full h-full object-cover rounded" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCreative, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

// Install modules
const images = [
  'https://swiperjs.com/demos/images/nature-1.jpg',
  'https://swiperjs.com/demos/images/nature-2.jpg',
  'https://swiperjs.com/demos/images/nature-3.jpg',
  'https://swiperjs.com/demos/images/nature-4.jpg',
];
</script>

<style scoped>
.mySwiper {
  width: 100%;
  max-width: 800px;
  height: 400px;
}
</style>