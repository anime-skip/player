import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import '~/common/styles';
import Options from './Options.vue';

// Inject DOM

createApp(Options).use(ui).mount('#app');
