import '@anime-skip/ui/lib/index.css';
import './index.scss';
import '@/common/shared.scss';

import { createApp } from 'vue';
import Popup from './Popup.vue';
import { store } from '@/common/store';
import AxiosApi from '@/common/api/AxiosApi';
import UI from '@anime-skip/ui';

// Setup Globals

global.Api = AxiosApi;

// Inject DOM

createApp(Popup).use(store).use(UI).mount('#app');
