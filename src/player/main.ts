import Vue from 'vue';
import Player from './Player.vue';
import store from './store';

const rootQuery = getRootQuery();
console.log(`Injecting player onto ${rootQuery}`);

Vue.config.productionTip = false;

const vue = new Vue({
  store,
  render: (h) => h(Player),
}).$mount();

const parent = document.querySelector(rootQuery) as HTMLElement;
parent.appendChild(vue.$el);
