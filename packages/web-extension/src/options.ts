import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import '~/common/styles';
import Container from './Container.vue';

createApp(Container).use(ui).mount('#app');
