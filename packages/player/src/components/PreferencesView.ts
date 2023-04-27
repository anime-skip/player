import { Component } from 'vue';
import { PreferencesView } from '../utils/preferences';
import PreferencesAlertView from './PreferencesAlertView.vue';
import PreferencesCheckboxView from './PreferencesCheckboxView.vue';
import PreferencesGridView from './PreferencesGridView.vue';
import PreferencesHeaderView from './PreferencesHeaderView.vue';
import PreferencesKeyboardShortcutsView from './PreferencesKeyboardShortcutsView.vue';
import PreferencesPlaybackRateView from './PreferencesPlaybackRateView.vue';
import PreferencesSelectView from './PreferencesSelectView.vue';
import PreferencesAllSettingsLinkView from './PreferencesAllSettingsLinkView.vue';
import PreferencesServiceSettingsView from './PreferencesServiceSettingsView.vue';
import { PropType } from 'vue';

const typeToComponentMap: Record<PreferencesView['type'], Component> = {
  'keyboard-shortcuts': PreferencesKeyboardShortcutsView,
  'playback-rate': PreferencesPlaybackRateView,
  checkbox: PreferencesCheckboxView,
  grid: PreferencesGridView,
  header: PreferencesHeaderView,
  select: PreferencesSelectView,
  alert: PreferencesAlertView,
  'all-settings-link': PreferencesAllSettingsLinkView,
  'service-settings': PreferencesServiceSettingsView,
};

export default defineComponent({
  name: 'PreferencesView',
  props: {
    views: { type: Array as PropType<PreferencesView[]>, required: true },
  },
  render() {
    return this.$props.views.map((view) => {
      const c = typeToComponentMap[view.type];
      if (c == null) {
        console.warn(`Unknown preference view: ${view.type}`);
        return h('div');
      } else {
        return h(typeToComponentMap[view.type], { view });
      }
    });
  },
});
