<template>
  <div class="ToolbarButton" v-ripple>
    <slot v-if="icon == null" />
    <WebExtImg v-else :src="icon" :draggable="false" />
    <p v-if="title" class="title">{{ title }}</p>
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
  @Prop(String) public title?: string;
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
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.06);
  }
  &:hover:active {
    background-color: rgba($color: #ffffff, $alpha: 0.12);
  }

  .title {
    color: $textPrimary;
    font-size: 15px;
    margin-left: 8px;
    padding-top: 4px;
  }
}
</style>
