import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import OptionsContainer from '~/components/OptionsContainer.vue';
import '~/styles';

createApp(OptionsContainer).use(ui).mount('#app');
