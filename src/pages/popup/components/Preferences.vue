<template>
  <ProgressOverlay :isLoading="isLoggingIn" class="Preferences">
    <div class="column">
      <PopupHeader title="Preferences" class="header"/>

      <h2 class="settings-group-label">General</h2>
      <div class="input-grid input-grid--2">
        <Checkbox :isChecked="true" text="Auto-skip sections"/>
        <Checkbox :isChecked="false" text="Force auto-play"/>
      </div>

      <h2 class="settings-group-label">Skipped Sections</h2>
      <div class="input-grid">
        <Checkbox :isChecked="true" text="Branding"/>
        <Checkbox :isChecked="true" text="Intros"/>
        <Checkbox :isChecked="false" text="Mixed Intros"/>
        <Checkbox :isChecked="true" text="Recaps"/>
        <Checkbox :isChecked="true" text="Title Cards"/>
        <Checkbox :isChecked="false" text="Canon"/>
        <Checkbox :isChecked="true" text="Filler"/>
        <Checkbox :isChecked="true" text="Transitions"/>
        <Checkbox :isChecked="true" text="Credits"/>
        <Checkbox :isChecked="false" text="Mixed Credits"/>
        <Checkbox :isChecked="true" text="Previews"/>
      </div>
      <p class="help">Need help?&ensp;<a href="">View Preference Descriptions</a></p>
    </div>
  </ProgressOverlay>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProgressOverlay from '../../../shared/components/ProgressOverlay.vue';
import PopupHeader from './PopupHeader.vue';
import Checkbox from './Checkbox.vue';

@Component({
  components: { ProgressOverlay, PopupHeader, Checkbox },
})
export default class Preferences extends Vue {}
</script>

<style lang="scss" scoped>
.Preferences {
  padding: 16px 24px;
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
  .help {
    padding: 16px 32px 0 32px;
    color: $textSecondary;
    font-size: 14px;
    align-self: stretch;
    text-align: center;
    a {
      color: $textPrimary;
    }
  }
}
</style>
