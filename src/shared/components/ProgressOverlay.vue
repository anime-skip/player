<template>
  <div class="Progress">
    <slot />
    <div class="spinner-wrapper" v-if="isLoading">
      <svg
        class="spinner"
        width="56px"
        height="56px"
        viewBox="0 0 56 56"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="path"
          fill="none"
          stroke-width="4"
          stroke-linecap="round"
          cx="28"
          cy="28"
          r="25"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Progress extends Vue {
  @Prop(Boolean) public isLoading!: boolean;
}
</script>

<style lang="scss" scoped>
$offset: 177;
$duration: 1.4s;

.Progress {
  position: relative;

  .spinner-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba($color: $background500, $alpha: 0.8);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .spinner {
    animation: rotator $duration linear infinite;
  }

  @keyframes rotator {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  .path {
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: dash $duration ease-in-out infinite,
      colors ($duration * 4) ease-in-out infinite;
  }

  @keyframes colors {
    0% {
      stroke: #4285f4;
    }
    25% {
      stroke: #de3e35;
    }
    50% {
      stroke: #f7c223;
    }
    75% {
      stroke: #1b9a59;
    }
    100% {
      stroke: #4285f4;
    }
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: $offset;
    }
    50% {
      stroke-dashoffset: $offset/4;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: $offset;
      transform: rotate(450deg);
    }
  }
}
</style>
