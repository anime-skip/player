<template>
  <ProgressOverlay :isLoading="isLoggingIn" class="Preferences">
    <div class="column">
      <PopupHeader title="Preferences" class="header" />

      <h2 class="settings-group-label">General</h2>
      <div class="input-grid input-grid--2">
        <Checkbox
          :isChecked="getPref('enableAutoSkip')"
          text="Skip selected sections"
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
      <div class="input-grid">
        <Checkbox
          v-for="preference in SKIPPABLE_PREFERENCES"
          :key="preference.key"
          :isChecked="getPref(preference.key)"
          :isDisabled="!getPref('enableAutoSkip')"
          :text="preference.title"
          @click.native="onClickPreference(preference.key)"
        />
      </div>
      <div class="bottom-row">
        <a class="link" href>Need help?</a>
        <a class="link" href="#" @click.prevent="logOut()">Log out</a>
      </div>
    </div>
  </ProgressOverlay>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';
import Checkbox from '@/common/components/Checkbox.vue';
import { Getter, Action, Mutation } from '@/common/utils/VuexDecorators';
import { SKIPPABLE_PREFERENCES } from '../../common/utils/Constants';

@Component({
  components: { ProgressOverlay, PopupHeader, Checkbox },
})
export default class Preferences extends Vue {
  @Getter() public preferences?: Api.Preferences;
  @Getter() public isLoggingIn!: boolean;

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
  padding: 32px 40px;
  .column {
    display: flex;
    flex-direction: column;
  }
  .input-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 16px;
    margin: 16px 0;
  }
  .input-grid--2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .settings-group-label {
    font-size: 14px;
    color: $textPrimary;
    margin-top: 16px;
  }
  a {
    color: $textPrimary;
  }
  .bottom-row {
    padding-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
