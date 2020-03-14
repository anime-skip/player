import Vue from 'vue';
import Player from './Player.vue';
import store from '@/common/store';
import Ripple from 'vue-ripple-directive';

console.info('INJECTED player/index.ts');

let existingPlayers = document.querySelectorAll('#AnimeSkipPlayer');
if (existingPlayers.length > 0) {
  console.info('Player already added, removing');
  existingPlayers.forEach(player => {
    player.remove();
  });
}

const rootQuery = global.getRootQuery();
console.log(`Adding player to ${rootQuery}`);

// Set the style to hide all the old elements
document.body.classList.add('hide-for-anime-skip');

Ripple.color = 'rgba(255, 255, 255, 0.12)';
Vue.directive('ripple', Ripple);
Vue.config.productionTip = false;

const vue = new Vue({
  store,
  render: h => h(Player),
}).$mount();
const parent = document.querySelector(rootQuery) as HTMLElement;
parent.appendChild(vue.$el);

global.onVideoChanged(video => {
  video.controls = false;
  video.autoplay = false;
});
