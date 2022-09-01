import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import PopupContainer from './components/PopupContainer.vue';
import '~/styles';
import { Provider } from '@anime-skip/player-ui/src/components/Provider';
import { providePlayerConfig } from '@anime-skip/player-ui/src/composables/usePlayerConfig';
import { defineNonPlayerConfig } from './utils/define-player-config';
import { createPinia } from 'pinia';

const Root = Provider(() => providePlayerConfig(defineNonPlayerConfig()), PopupContainer);

createApp(Root).use(ui).use(createPinia()).mount('#app');
