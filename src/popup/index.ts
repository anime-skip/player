import './index.scss';
import '@/common/shared.scss';
import 'tailwindcss/tailwind.css';

import { createApp } from 'vue';
import Popup from './Popup.vue';
import { store } from '@/common/store';
import AxiosApi from '@/common/api/AxiosApi';

import ui from '@anime-skip/ui';
import '@anime-skip/ui/style.css';
import 'tailwindcss/tailwind.css';

// Setup Globals

global.Api = AxiosApi;

// Inject DOM

createApp(Popup).use(store).use(ui).mount('#app');
