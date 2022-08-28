<template>
  <transition name="as-dialog">
    <div
      v-if="visible"
      :id="name"
      class="BasicDialog as-absolute as-inset-0 as-flex as-flex-col as-cursor-pointer as-overflow-visible"
      :style="`align-items: ${gravityX}; justify-content: ${gravityY}`"
      @click.stop="emit('dismiss')"
    >
      <Card
        class="as-dialog-root-container as-bg-background as-overflow-x-hidden as-overflow-y-auto as-cursor-auto as-rounded-md"
        :elevation="8"
        @click.stop
      >
        <slot />
      </Card>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  name: string;
  visible: boolean;
  gravityX: 'center' | 'flex-start' | 'flex-end';
  gravityY: 'center' | 'flex-start' | 'flex-end';
}>();

const emit = defineEmits<{
  (event: 'show'): void;
  (event: 'hide'): void;
  (event: 'dismiss'): void;
}>();

watch(
  () => props.visible,
  (newVisible, oldVisible) => {
    if (newVisible && !oldVisible) emit('show');
    if (!newVisible && oldVisible) emit('hide');
  }
);
</script>

<style lang="scss" scoped>
.as-dialog-enter-active,
.as-dialog-leave-active {
  transition-property: opacity;
  transition-duration: 250ms;
}
.as-dialog-enter,
.as-dialog-leave-to {
  opacity: 0;
}
.as-dialog-enter-to,
.as-dialog-leave {
  opacity: 1;
}

.BasicDialog {
  z-index: 2;
  * {
    padding: 0;
    margin: 0;
    text-align: left;
  }

  .as-dialog-root-container {
    transform: translate(0px, 0px);
    transition: 250ms;
    transition-property: transform, opacity;
  }
}
</style>
