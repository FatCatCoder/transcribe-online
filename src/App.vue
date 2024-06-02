<script setup>
import HelloWorld from './components/HelloWorld.vue';
import PWABadge from './components/PWABadge.vue';
import WavesurferComp from './components/WavesurferComp.vue';
</script>

<template>
  <h1 class="text-3xl font-bold text-indigo-500">Transcribe Online!</h1>
  <div>
    <WavesurferComp />
  </div>
  <HelloWorld msg="vite-project" />
  <PWABadge />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
