import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import Options from '@anime-skip/player-ui/src/pages/Options.vue';
import '~/styles';
import { Provider } from '@anime-skip/player-ui/src/components/Provider';
import { providePlayerConfig } from '@anime-skip/player-ui/src/composables/usePlayerConfig';
import { defineNonPlayerConfig } from './utils/define-player-config';
import { createPinia } from 'pinia';
import { InternalPlayerConfig } from '~types';
import { provideApiClient } from '@anime-skip/player-ui/src/composables/useApiClient';
import { VueQueryPlugin } from 'vue-query';

const RootComponent = (config: InternalPlayerConfig) =>
  Provider(
    () => providePlayerConfig(config),
    Provider(() => provideApiClient(config), Options)
  );

createApp(RootComponent(defineNonPlayerConfig()))
  .use(ui)
  .use(VueQueryPlugin)
  .use(createPinia())
  .mount('#app');
