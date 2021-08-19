import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import AxiosApi from '~/common/api/AxiosApi';
import { store } from '~/common/store';
import '~/common/styles';
import Options from './Options.vue';

// Setup Globals

window.Api = AxiosApi;

// Inject DOM

createApp(Options).use(store).use(ui).mount('#app');
