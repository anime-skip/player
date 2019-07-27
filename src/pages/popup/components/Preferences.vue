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
        <Checkbox :isChecked="getPref('skipIntros')" text="Intros" @click.native="onClickIntros" />
        <Checkbox
          :isChecked="getPref('skipNewIntros')"
          text="New Intros"
          @click.native="onClickNewIntros"
        />
        <Checkbox :isChecked="getPref('skipRecaps')" text="Recaps" @click.native="onClickRecaps" />
        <Checkbox
          :isChecked="getPref('skipTitleCard')"
          text="Title Cards"
          @click.native="onClickTitleCards"
        />
        <Checkbox :isChecked="getPref('skipCanon')" text="Canon" @click.native="onClickCanon" />
        <Checkbox :isChecked="getPref('skipFiller')" text="Filler" @click.native="onClickFiller" />
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProgressOverlay from '../../../shared/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';
import Checkbox from './Checkbox.vue';
import { Getter, Action, Mutation } from '../../../shared/utils/VuexDecorators';

@Component({
  components: { ProgressOverlay, PopupHeader, Checkbox },
})
export default class Preferences extends Vue {
  @Getter('preferences') public preferences?: Api.Preferences;

  @Action('togglePref') public togglePreference!: (
    pref: keyof Api.Preferences,
  ) => void;
  @Mutation('logOut') public logOut!: () => void;

  public togglePref(pref: keyof Api.Preferences): void {
    this.togglePreference(pref);
  }

  public getPref(pref: keyof Api.Preferences): boolean {
    const prefs = this.preferences;
    if (!prefs) {
      return false;
    }
    return prefs[pref];
  }

  public onClickAutoSkip() {
    this.togglePreference('enableAutoSkip');
  }
  public onClickAutoPlay() {
    this.togglePreference('enableAutoPlay');
  }
  public onClickBranding() {
    this.togglePreference('skipBranding');
  }
  public onClickIntros() {
    this.togglePreference('skipIntros');
  }
  public onClickNewIntros() {
    this.togglePreference('skipNewIntros');
  }
  public onClickRecaps() {
    this.togglePreference('skipRecaps');
  }
  public onClickTitleCards() {
    this.togglePreference('skipTitleCard');
  }
  public onClickCanon() {
    this.togglePreference('skipCanon');
  }
  public onClickFiller() {
    this.togglePreference('skipFiller');
  }
  public onClickTransitions() {
    this.togglePreference('skipTransitions');
  }
  public onClickCredits() {
    this.togglePreference('skipCredits');
  }
  public onClickMixedCredits() {
    this.togglePreference('skipMixedCredits');
  }
  public onClickPreviews() {
    this.togglePreference('skipPreview');
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
