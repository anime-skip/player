import Vue from 'vue';
import Options from './Options.vue';

Vue.config.productionTip = false;

const vue = new Vue({
    render: (h) => h(Options),
}).$mount('#app');
