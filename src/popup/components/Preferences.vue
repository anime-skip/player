<template>
  <ProgressOverlay v-if="!isPlayerOptionPicker" :isLoading="isLoggingIn" class="Preferences">
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
          <WebExtImg :src="optionGroup.icon" class="left" />
          <span class="label">{{ optionGroup.title }}</span>
          <span class="value">{{ getSelectedOption(optionGroup) }}</span>
          <WebExtImg src="ic_chevron_right.svg" class="right" />
        </div>
        <Checkbox
          :isChecked="getPref('enableAutoSkip')"
          text="Auto-skip Sections"
          @click.native="updatePreferences('enableAutoSkip')"
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
          @click.native="onClickPreference(preference.key)"
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
        <a class="link" href>Need help?</a>
        <a class="link" href="#" @click.prevent="logOut()">Log out</a>
      </div>
    </div>
  </ProgressOverlay>
  <div v-else class="Preferences player-options column">
    <h3 class="player-option-title" @click="onClickOptionGroupBack">
      <WebExtImg src="ic_chevron_left.svg" />
      <span>{{ activePlayerOption.title }}</span>
    </h3>
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';
import Checkbox from '@/common/components/Checkbox.vue';
import TextInput from '@/common/components/TextInput.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import PlaybackRatePicker from '@/common/components/PlaybackRatePicker.vue';
import { Getter, Action, Mutation } from '@/common/utils/VuexDecorators';
import { SKIPPABLE_PREFERENCES } from '../../common/utils/Constants';
import Messenger from '@/common/utils/Messenger';

@Component({
  components: { ProgressOverlay, PopupHeader, Checkbox, TextInput, PlaybackRatePicker, WebExtImg },
})
export default class Preferences extends Vue {
  @Prop(Boolean) public small?: string;

  @Getter() public preferences?: Api.Preferences;
  @Getter() public isLoggingIn!: boolean;
  @Getter() public hasPreferenceError!: boolean;

  @Action() public updatePreferences!: (pref: keyof Api.Preferences) => void;
  @Action('showDialog') public hideDialog!: () => void;

  @Mutation() public logOut!: () => void;

  public activePlayerOption?: PlayerOptionGroup;

  public constructor() {
    super();
  }

  public mounted(): void {
    this.playerOptions;
  }

  public data() {
    return {
      activePlayerOption: undefined,
    };
  }

  public get SKIPPABLE_PREFERENCES(): SkippablePreference[] {
    return SKIPPABLE_PREFERENCES;
  }

  public getPref(pref: keyof Api.Preferences): boolean {
    const prefs = this.preferences;
    if (!prefs) {
      return false;
    }
    return prefs[pref];
  }

  public onClickAutoSkip() {
    this.updatePreferences('enableAutoSkip');
  }

  public onClickPreference(preferenceKey: keyof Api.Preferences): void {
    this.updatePreferences(preferenceKey);
  }

  public onClickKeyboardShortcuts(): void {
    new Messenger('preferences').send('@anime-skip/open-options', undefined).then(this.hideDialog);
  }

  public get hasPlayerOptions(): boolean {
    return !!global.getPlayerOptions;
  }

  public get isPlayerOptionPicker(): boolean {
    console.log('isPlayerOptionPicker', { activeOption: this.activePlayerOption });
    return this.activePlayerOption != null;
  }

  public get playerOptions(): PlayerOptionGroup[] {
    const options = (global.getPlayerOptions && global.getPlayerOptions()) || [];
    return options.filter(group => group.options.length > 1);
  }

  public onClickOptionGroup(optionGroup: PlayerOptionGroup): void {
    Vue.set(this, 'activePlayerOption', optionGroup);
    this.activePlayerOption = optionGroup;
  }

  public getSelectedOption(optionGroup: PlayerOptionGroup): string {
    const selected = optionGroup.options.filter(option => option.isSelected);
    console.log({ optionGroup, selected });
    if (selected.length === 0) return '';

    return selected[0].title;
  }

  public onClickOptionGroupBack(): void {
    Vue.set(this, 'activePlayerOption', undefined);
  }

  public onClickOption(option: PlayerOption): void {
    option.node.click();
    this.hideDialog();
  }
}
</script>

<style lang="scss" scoped>
.Preferences {
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
</style>
