import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import '~/common/styles';
import Popup from './Popup.vue';

// Inject DOM

createApp(Popup).use(ui).mount('#app');
