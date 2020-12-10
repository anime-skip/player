<template>
  <div
    class="Checkbox clickable"
    :title="tooltip"
    :class="{ 'dark down': !isChecked, disabled: isDisabled }"
  >
    <WebExtImg class="checkmark" :src="icon" />
    <span class="text" :class="{ selected: isChecked }">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WebExtImg from '@/common/components/WebExtImg.vue';

export default defineComponent({
  components: { WebExtImg },
  props: {
    isChecked: { type: Boolean, required: true },
    isDisabled: Boolean,
    text: { type: String, required: true },
    tooltip: String,
  },
  computed: {
    icon(): string {
      return `ic_${this.isChecked ? 'checked' : 'unchecked'}.svg`;
    },
  },
});
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
    color: $textPrimary;
    &.selected {
      color: $textPrimary;
    }
  }
}
</style>
