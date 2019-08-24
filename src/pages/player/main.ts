import Vue from 'vue';
import Player from './Player.vue';
import store from '../../shared/store';
import Ripple from 'vue-ripple-directive';

const rootQuery = getRootQuery();
console.info(`Injecting player onto ${rootQuery}`);

video.controls = false;
video.autoplay = false;
video.pause();

const elementsToHide = getElementsToHide();
elementsToHide.forEach(element => {
  element.remove();
});

Ripple.color = 'rgba(255, 255, 255, 0.12)';
Vue.directive('ripple', Ripple);

Vue.config.productionTip = false;

const vue = new Vue({
  store,
  render: h => h(Player),
}).$mount();
const parent = document.querySelector(rootQuery) as HTMLElement;
parent.appendChild(vue.$el);
