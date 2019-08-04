import Vue from 'vue';
import Player from './Player.vue';
import store from '../../shared/store';

const rootQuery = getRootQuery();
console.info(`Injecting player onto ${rootQuery}`);

video.controls = false;
video.autoplay = false;
video.pause();

const elementsToHide = getElementsToHide();
elementsToHide.forEach(element => {
  element.remove();
});

Vue.config.productionTip = false;
const vue = new Vue({
  store,
  render: h => h(Player),
}).$mount();

const parent = document.querySelector(rootQuery) as HTMLElement;
parent.appendChild(vue.$el);
