<script setup>
import PWABadge from './components/PWABadge.vue';
import Transcriber from './components/Transcriber.vue';
</script>

<template>
  <div :class="w-25">
  <h1 class="text-3xl font-bold text-indigo-500">Transcribe Online!</h1>
  <div>
    <Transcriber />
  </div>

  <PWABadge />
  </div>
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
