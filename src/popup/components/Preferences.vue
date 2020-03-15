<template>
  <ProgressOverlay :isLoading="isLoggingIn" class="Preferences">
    <div class="column">
      <PopupHeader title="Preferences" class="header" :small="small" />

      <h2 class="settings-group-label">General</h2>
      <div class="input-grid input-grid--2" :class="{ small }">
        <Checkbox
          :isChecked="getPref('enableAutoSkip')"
          text="Auto-skip Sections"
          @click.native="updatePreferences('enableAutoSkip')"
        />
        <!-- 
        <Checkbox
          :isChecked="getPref('enableAutoPlay')"
          text="Force video auto-play"
          @click.native="onClickAutoPlay"
        />
        -->
      </div>

      <h2 class="settings-group-label">Skipped Sections</h2>
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
      <div class="bottom-row">
        <a class="link" href>Need help?</a>
        <a class="link" href="#" @click.prevent="logOut()">Log out</a>
      </div>
    </div>
  </ProgressOverlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';
import Checkbox from '@/common/components/Checkbox.vue';
import { Getter, Action, Mutation } from '@/common/utils/VuexDecorators';
import { SKIPPABLE_PREFERENCES } from '../../common/utils/Constants';

@Component({
  components: { ProgressOverlay, PopupHeader, Checkbox },
})
export default class Preferences extends Vue {
  @Prop(Boolean) public small?: string;

  @Getter() public preferences?: Api.Preferences;
  @Getter() public isLoggingIn!: boolean;
  @Getter() public hasPreferenceError!: boolean;

  @Action() public updatePreferences!: (pref: keyof Api.Preferences) => void;

  @Mutation() public logOut!: () => void;

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
  .settings-group-label {
    font-size: 14px;
    color: $textPrimary;
    margin-top: 16px;
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
}
</style>
