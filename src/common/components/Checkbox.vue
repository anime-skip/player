<template>
  <div class="Checkbox clickable" :class="{ 'dark down': !isChecked }">
    <WebExtImg class="checkmark" :src="getIcon()" />
    <span class="text" :class="{ selected: isChecked }">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import WebExtImg from '@/common/components/WebExtImg.vue';

@Component({
  components: { WebExtImg },
})
export default class Checkbox extends Vue {
  @Prop(Boolean) public isChecked!: boolean;
  @Prop(Boolean) public isDisabled!: boolean;
  @Prop(String) public text!: string;

  public getIcon(): string {
    return `ic-${this.isChecked ? 'checked' : 'unchecked'}.svg`;
  }
}
</script>

<style lang="scss" scoped>
.Checkbox {
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  padding-left: 8px;
  padding-right: 12px;
  cursor: pointer;
  .checkmark {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .text {
    flex: 1;
    font-weight: 700;
    padding-top: 2px;
    font-size: 14px;
    color: $textSecondary;
    &.selected {
      color: $textPrimary;
    }
  }
}
</style>
