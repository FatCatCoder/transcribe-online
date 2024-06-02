import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
// import Lara from "./presets/lara/index.js";

const app = createApp(App);
// app.use(PrimeVue, { unstyled: true, pt: Lara });
app.use(PrimeVue, { unstyled: true });
app.mount("#app");

