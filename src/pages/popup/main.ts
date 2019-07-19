import Vue from 'vue';
import Popup from './Popup.vue';
import store from '../../shared/store';


Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Popup),
  store,
}).$mount('#app');
