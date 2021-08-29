<template>
  <slot />
</template>

<script lang="ts" setup>
// Fake component to silence warnings for FlatButtons
defineProps<{
  to: string;
  target: any;
}>();
</script>
