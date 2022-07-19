import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import PopupContainer from '~/components/PopupContainer.vue';
import '~/styles';

createApp(PopupContainer).use(ui).mount('#app');
