import { createApp } from 'vue';
import { RouterView } from 'vue-router';
import router from './router';
import '~/assets/tailwind.css';

setInterval(async () => {
  await windowPosition.setValue({
    width: window.outerWidth,
    height: window.outerHeight,
    left: window.screenLeft,
    top: window.screenTop,
  });
}, 5000);

createApp(RouterView).use(router).mount('#app');
