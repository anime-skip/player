import './index.scss';
import Vue from 'vue';
import Options from './Options.vue';
import AxiosApi from '@/common/api/AxiosApi';

// Setup Globals

global.Api = AxiosApi;

// Inject DOM

Vue.config.productionTip = false;

new Vue({
  render: h => h(Options),
}).$mount('#app');
