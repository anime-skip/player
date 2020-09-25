import './index.scss';
import '@/common/shared.scss';
import Vue from 'vue';
import Options from './Options.vue';
import AxiosApi from '@/common/api/AxiosApi';
import store from '@/common/store';

// Setup Globals

global.Api = AxiosApi;
// @ts-ignore
global.getVideo = () => undefined;

// Inject DOM

Vue.config.productionTip = false;

new Vue({
  render: h => h(Options),
  store,
}).$mount('#app');
