import { createApp } from 'vue';
import Options from './Options.vue';
import AxiosApi from '@/common/api/AxiosApi';
import { store } from '@/common/store';

import ui from '@anime-skip/ui';
import '@/common/css';

// Setup Globals

global.Api = AxiosApi;

// Inject DOM

createApp(Options).use(store).use(ui).mount('#app');
