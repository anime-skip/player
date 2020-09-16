<template>
  <div class="wrapper">
    <div class="EditTimestampHandle" v-ripple @click="onClick">
      <WebExtImg class="add" src="ic_add_timestamp.svg" :draggable="false" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WebExtImg from '@/common/components/WebExtImg.vue';

@Component({
  components: { WebExtImg },
})
export default class EditTimestampHandle extends Vue {
  onClick(): void {
    this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  bottom: 12px;
  width: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: visible;
}
.EditTimestampHandle {
  min-width: 40px;
  min-height: 40px;
  background-color: $divider;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  transition: 250ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.18);
  }
}
</style>
