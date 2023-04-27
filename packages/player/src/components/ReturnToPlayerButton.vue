<script lang="ts" setup>
import { PlayerVisibility } from '../utils/PlayerVisibility';
import ThemedLogo from './ThemedLogo.vue';

const visibility = usePlayerVisibility();
</script>

<template>
  <button
    class="btn btn-lg gap-4 normal-case"
    @click="visibility = PlayerVisibility.Visible"
  >
    <span>Return to Anime Skip</span>
    <themed-logo class="h-6 w-10" />
  </button>
</template>
