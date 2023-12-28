<script setup lang="ts">
import { version } from '../../package.json';
import ThemedLogo from './ThemedLogo.vue';

const isOpen = ref(false);
const position = ref({ x: 0, y: 0 });

useEventListener('contextmenu', (event) => {
  // Only listen for right clicks on the player
  const targetTag = (event.target as Element | undefined)?.tagName;
  if (targetTag !== 'ANIME-SKIP-PLAYER') return;

  event.preventDefault();
  isOpen.value = !isOpen.value;
  position.value = {
    x: event.pageX,
    y: event.pageY,
  };
});

const { takeScreenshot, isScreenshotEnabled } = useTakeScreenshot(() => {
  isOpen.value = false;
});
</script>

<template>
  <!-- Backdrop -->
  <Transition>
    <div
      v-if="isOpen"
      class="absolute inset-0 bg-black bg-opacity-10"
      @click="isOpen = !isOpen"
    />
  </Transition>

  <!-- Modal -->
  <Transition>
    <ul
      v-if="isOpen"
      class="absolute menu menu-compact bg-base-100 rounded-box w-56 shadow-2xl"
      :style="`left: ${position.x}px; top: ${position.y}px`"
    >
      <li>
        <div
          class="flex gap-4 items-center bg-base-300 cursor-default text-base-content"
        >
          <themed-logo class="h-4 w-6 shrink-0" />
          <div class="flex flex-col gap-0 items-start">
            <h2>Anime Skip Player</h2>
            <p class="text-xs opacity-50">v{{ version }}</p>
          </div>
        </div>
      </li>
      <li v-if="isScreenshotEnabled">
        <button @click="takeScreenshot">Take Screenshot</button>
      </li>
    </ul>
  </Transition>
</template>
