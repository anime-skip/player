import './index.scss';
import '@/common/shared.scss';
import Vue from 'vue';
import Popup from './Popup.vue';
import store from '../common/store';
import AxiosApi from '@/common/api/AxiosApi';

// Setup Globals

global.Api = AxiosApi;

// Inject DOM

Vue.config.productionTip = false;

new Vue({
  render: h => h(Popup),
  store,
}).$mount('#app');
