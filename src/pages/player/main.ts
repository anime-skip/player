import Vue from 'vue';
import Player from './Player.vue';
import store from '../../shared/store';
import Ripple from 'vue-ripple-directive';

const rootQuery = getRootQuery();
const parent = document.querySelector(rootQuery) as HTMLElement;
parent.classList.add('hide-for-anime-skip');
console.info(`Injecting player onto ${rootQuery}`);

Ripple.color = 'rgba(255, 255, 255, 0.12)';
Vue.directive('ripple', Ripple);

Vue.config.productionTip = false;

const vue = new Vue({
  store,
  render: h => h(Player),
}).$mount();
parent.appendChild(vue.$el);

onVideoChanged(video => {
  video.controls = false;
  video.autoplay = false;
});
// @ts-ignore
checkVideoChanged();
getVideo().pause();
