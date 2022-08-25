import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import OptionsContainer from '@anime-skip/player-ui/src/components/OptionsContainer.vue';
import '~/styles';
import { Provider } from '@anime-skip/player-ui/src/components/Provider';
import { providePlayerConfig } from '@anime-skip/player-ui/src/composables/usePlayerConfig';
import { defineNonPlayerConfig } from './utils/define-player-config';

const Root = Provider(() => providePlayerConfig(defineNonPlayerConfig()), OptionsContainer);

createApp(Root).use(ui).mount('#app');
