import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import OptionsContainer from '~/components/OptionsContainer.vue';
import '~/styles';
import { Provider } from './components/Provider';
import { providePlayerStorage } from './composables/usePlayerConfig';
import { createPlayerWebExtStorage } from './utils/player-web-ext-storage';

const Root = Provider(() => providePlayerStorage(createPlayerWebExtStorage()), OptionsContainer);

createApp(Root).use(ui).mount('#app');
