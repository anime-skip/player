<template>
  <ProgressOverlay :isLoading="isLoggingIn" class="Preferences">
    <div class="column">
      <PopupHeader title="Preferences" class="header" />

      <h2 class="settings-group-label">General</h2>
      <div class="input-grid input-grid--2">
        <Checkbox
          :isChecked="getPref('enableAutoSkip')"
          text="Skip specified sections"
          @click.native="onClickAutoSkip"
        />
        <Checkbox
          :isChecked="getPref('enableAutoPlay')"
          text="Force video auto-play"
          @click.native="onClickAutoPlay"
        />
      </div>

      <h2 class="settings-group-label">Skipped Sections</h2>
      <div class="input-grid">
        <Checkbox
          :isChecked="getPref('skipBranding')"
          text="Branding"
          @click.native="onClickBranding"
        />
        <Checkbox
          :isChecked="getPref('skipRecaps')"
          text="Recaps"
          @click.native="onClickRecaps"
        />
        <Checkbox
          :isChecked="getPref('skipTitleCard')"
          text="Title Cards"
          @click.native="onClickTitleCards"
        />
        <Checkbox
          :isChecked="getPref('skipIntros')"
          text="Intros"
          @click.native="onClickIntros"
        />
        <Checkbox
          :isChecked="getPref('skipNewIntros')"
          text="New Intros"
          @click.native="onClickNewIntros"
        />
        <Checkbox
          :isChecked="getPref('skipMixedIntros')"
          text="Mixed Intros"
          @click.native="onClickMixedIntros"
        />
        <Checkbox
          :isChecked="getPref('skipCanon')"
          text="Canon"
          @click.native="onClickCanon"
        />
        <Checkbox
          :isChecked="getPref('skipFiller')"
          text="Filler"
          @click.native="onClickFiller"
        />
        <Checkbox
          :isChecked="getPref('skipTransitions')"
          text="Transitions"
          @click.native="onClickTransitions"
        />
        <Checkbox
          :isChecked="getPref('skipCredits')"
          text="Credits"
          @click.native="onClickCredits"
        />
        <Checkbox
          :isChecked="getPref('skipNewCredits')"
          text="New Credits"
          @click.native="onClickNewCredits"
        />
        <Checkbox
          :isChecked="getPref('skipMixedCredits')"
          text="Mixed Credits"
          @click.native="onClickMixedCredits"
        />
        <Checkbox
          :isChecked="getPref('skipPreview')"
          text="Previews"
          @click.native="onClickPreviews"
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

@Component({
  components: { ProgressOverlay, PopupHeader, Checkbox },
})
export default class Preferences extends Vue {
  @Getter() public preferences?: Api.Preferences;

  @Action() public updatePreferences!: (pref: keyof Api.Preferences) => void;
  @Mutation() public logOut!: () => void;

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
  public onClickAutoPlay() {
    this.updatePreferences('enableAutoPlay');
  }
  public onClickBranding() {
    this.updatePreferences('skipBranding');
  }
  public onClickRecaps() {
    this.updatePreferences('skipRecaps');
  }
  public onClickTitleCards() {
    this.updatePreferences('skipTitleCard');
  }
  public onClickIntros() {
    this.updatePreferences('skipIntros');
  }
  public onClickNewIntros() {
    this.updatePreferences('skipNewIntros');
  }
  public onClickMixedIntros() {
    this.updatePreferences('skipMixedIntros');
  }
  public onClickCanon() {
    this.updatePreferences('skipCanon');
  }
  public onClickFiller() {
    this.updatePreferences('skipFiller');
  }
  public onClickTransitions() {
    this.updatePreferences('skipTransitions');
  }
  public onClickCredits() {
    this.updatePreferences('skipCredits');
  }
  public onClickNewCredits() {
    this.updatePreferences('skipNewCredits');
  }
  public onClickMixedCredits() {
    this.updatePreferences('skipMixedCredits');
  }
  public onClickPreviews() {
    this.updatePreferences('skipPreview');
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
