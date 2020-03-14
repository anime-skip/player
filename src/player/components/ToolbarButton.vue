<template>
  <div class="ToolbarButton" v-ripple>
    <slot v-if="icon == null" />
    <WebExtImg v-else :src="icon" :draggable="false" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import WebExtImg from '@/common/components/WebExtImg.vue';

@Component({
  components: { WebExtImg },
})
export default class ToolbarButton extends Vue {
  @Prop(String) public icon?: string;
}
</script>

<style lang="scss" scoped>
.ToolbarButton {
  height: 24px;
  padding: 5px 8px;
  background-color: transparent;
  border-radius: 4px;
  transition: 200ms;
  transition-property: background-color;
  cursor: pointer;
  &:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.06);
  }
  &:hover:active {
    background-color: rgba($color: #ffffff, $alpha: 0.12);
  }
}
</style>
