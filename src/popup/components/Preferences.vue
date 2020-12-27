<template>
  <ProgressOverlay v-if="activePlayerOption == null" :isLoading="isLoggingIn" class="Preferences">
    <div class="column">
      <PopupHeader title="Preferences" class="header" :small="small" />

      <h2 class="section-header">General</h2>
      <div class="input-grid input-grid--2" :class="{ small }">
        <PlaybackRatePicker :showLess="!small" />
        <div
          v-for="optionGroup of playerOptions"
          :key="optionGroup.title"
          class="option-group-button clickable dark focus button"
          @click="onClickOptionGroup(optionGroup)"
        >
          <WebExtImg v-if="optionGroup.icon != null" :src="optionGroup.icon" class="left" />
          <span class="label">{{ optionGroup.title }}</span>
          <span class="value">{{ getSelectedOption(optionGroup) }}</span>
          <WebExtImg src="ic_chevron_right.svg" class="right" />
        </div>
        <Checkbox
          :isChecked="getPref('enableAutoSkip')"
          text="Auto-skip Sections"
          @click="updatePreferences('enableAutoSkip')"
        />
      </div>

      <h2 class="section-header">What do you want to skip?</h2>
      <div class="input-grid" :class="{ small }">
        <Checkbox
          v-for="preference in SKIPPABLE_PREFERENCES"
          :key="preference.key"
          :isChecked="getPref(preference.key)"
          :isDisabled="!getPref('enableAutoSkip')"
          :text="preference.title"
          @click="onClickPreference(preference.key)"
        />
      </div>
      <span v-if="hasPreferenceError" class="error-message">
        Could not save preferences, please try again later
      </span>
      <h2 class="section-header">Other Settings</h2>
      <div class="clickable dark focus button other-setting" @click="onClickKeyboardShortcuts">
        <span>Edit Keyboard Shortcuts</span>
        <WebExtImg src="ic_chevron_right.svg" />
      </div>
      <div class="bottom-row">
        <a class="link" href="https://www.anime-skip.com/support" target="_blank">Need help?</a>
        <a class="link" href="#" @click.prevent="logOut()">Log out</a>
      </div>
    </div>
  </ProgressOverlay>
  <div v-else class="Preferences player-options column">
    <h3 class="player-option-title" @click="onClickOptionGroupBack">
      <WebExtImg src="ic_chevron_left.svg" />
      <span>{{ activePlayerOption.title }}</span>
    </h3>
    <div class="list">
      <div
        v-for="option of activePlayerOption.options"
        :key="option.title"
        class="player-option button clickable focus"
        :class="{ dark: !option.isSelected }"
        @click="onClickOption(option)"
      >
        <span>{{ option.title }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';
import Checkbox from '@/common/components/Checkbox.vue';
import TextInput from '@/common/components/TextInput.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import PlaybackRatePicker from '@/common/components/PlaybackRatePicker.vue';
import { SKIPPABLE_PREFERENCES } from '@/common/utils/Constants';
import Messenger from '@/common/utils/Messenger';
import { ActionTypes } from '@/common/store/actionTypes';
import { MutationTypes } from '@/common/store/mutationTypes';
import { GetterTypes } from '@/common/store/getterTypes';

export default defineComponent({
  components: { ProgressOverlay, PopupHeader, Checkbox, TextInput, PlaybackRatePicker, WebExtImg },
  props: {
    small: Boolean,
  },
  mounted(): void {
    this.playerOptions; // TODO! huh?
  },
  data() {
    return {
      activePlayerOption: undefined as PlayerOptionGroup | undefined,
      messenger: new Messenger('preferences'),
    };
  },
  computed: {
    preferences(): Api.Preferences | undefined {
      return this.$store.getters[GetterTypes.PREFERENCES];
    },
    isLoggingIn(): boolean {
      return this.$store.getters[GetterTypes.IS_LOGGING_IN];
    },
    hasPreferenceError(): boolean {
      return this.$store.getters[GetterTypes.HAS_PREFERENCE_ERROR];
    },
    SKIPPABLE_PREFERENCES(): SkippablePreference[] {
      return SKIPPABLE_PREFERENCES;
    },
    hasPlayerOptions(): boolean {
      return !!global.getPlayerOptions;
    },
    playerOptions(): PlayerOptionGroup[] {
      const options = (global.getPlayerOptions && global.getPlayerOptions()) || [];
      return options.filter(group => group.options.length > 1);
    },
  },
  methods: {
    updatePreferences(pref: keyof Api.Preferences): void {
      this.$store.dispatch(ActionTypes.UPDATE_PREFERENCES, pref);
    },
    hideDialog(): void {
      // TODO: Pull dialog ids into constants
      // TODO: Create a hideDialog action
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, undefined);
    },
    logOut(): void {
      this.$store.commit(MutationTypes.LOG_OUT);
    },
    getPref(pref: keyof Api.Preferences): boolean {
      const prefs = this.preferences;
      if (!prefs) {
        return false;
      }
      return prefs[pref];
    },
    onClickAutoSkip() {
      this.updatePreferences('enableAutoSkip');
    },
    onClickPreference(preferenceKey: keyof Api.Preferences): void {
      this.updatePreferences(preferenceKey);
    },
    onClickKeyboardShortcuts(): void {
      this.messenger.send('@anime-skip/open-options', undefined).then(this.hideDialog);
    },
    onClickOptionGroup(optionGroup: PlayerOptionGroup): void {
      this.activePlayerOption = optionGroup; // TODO: Test set
    },
    getSelectedOption(optionGroup: PlayerOptionGroup): string {
      const selected = optionGroup.options.filter(option => option.isSelected);
      if (selected.length === 0) return '';

      return selected[0].title;
    },
    onClickOptionGroupBack(): void {
      this.activePlayerOption = undefined;
    },
    onClickOption(option: PlayerOption): void {
      option.node.click();
      this.hideDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
.Preferences {
  min-width: 250px;
  max-width: 700px;

  .column {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .input-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(150px, 1fr));
    grid-gap: 16px;
    margin: 16px 0;
    align-items: stretch;
    &.small {
      grid-template-columns: repeat(2, minmax(150px, 1fr));
    }
  }
  .input-grid--2 {
    align-items: stretch;
    grid-template-columns: repeat(2, minmax(225px, 1fr));
    &.small {
      grid-template-columns: repeat(1, minmax(225px, 1fr));
    }
  }
  a {
    color: $textPrimary;
    font-size: 15px;
  }
  .error-message {
    color: $red400;
  }
  .bottom-row {
    padding-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .option-group-button {
    height: 38px;
    display: flex;
    flex-direction: row;
    align-items: center;

    img.left {
      margin-right: 16px;
    }

    span {
      text-transform: none;

      &.label {
        margin-right: 8px;
      }
      &.value {
        flex: 1;
        text-align: right;
        font-weight: 400;
        opacity: 0.64;
      }
    }

    img.right {
      margin-left: 8px;
      opacity: 0.48;
    }
  }

  .other-setting {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    align-self: flex-start;
    text-transform: none;
    align-items: center;

    img {
      margin-left: 8px;
    }
  }
}

.Preferences.player-options {
  overflow-x: hidden;

  .list {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .player-option-title {
    cursor: pointer;
    margin-top: 4px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;

    span {
      color: $textPrimary;
    }

    img {
      margin-right: 8px;
      opacity: 0.64;
    }
  }

  .player-option {
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      margin-right: 16px;
    }
  }
}
</style>
