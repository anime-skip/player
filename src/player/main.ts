import Vue from 'vue';
import Player from './Player.vue';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(Player),
}).$mount('#gb');
