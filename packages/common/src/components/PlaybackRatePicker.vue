<template>
  <div class="PlaybackRatePicker">
    <div
      class="as-flex as-items-stretch as-justify-items-stretch as-h-10 as-w-full as-divide-x-2 as-divide-background as-rounded-sm as-bg-control"
    >
      <div class="as-p-2 as-flex-shrink-0">
        <icon path="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z" />
      </div>
      <div v-for="speed in playbackSpeeds" :key="speed.value" class="as-flex-1 as-min-w-10">
        <raised-container
          class="as-cursor-pointer as-text-on-surface as-box-border as-w-full as-h-full"
          :down="!isRateSelected(speed.value)"
          :dark="!isRateSelected(speed.value)"
          @click="onClickOption(speed.value)"
        >
          <span
            class="as-transition-colors as-body-1"
            :class="{ 'as-text-on-primary': isRateSelected(speed.value) }"
            >{{ speed.display }}</span
          >
        </raised-container>
      </div>
      <div class="as-flex-grow as-flex-shrink-0 as-w-10 as-box-border">
        <raised-container
          :down="!customRate"
          :dark="!customRate"
          :error="isCustomError"
          class="as-w-full as-p-0"
          :tabindex="-1"
        >
          <input
            type="text"
            step="0.01"
            :maxlength="4"
            class="as-bg-transparent as-w-full as-h-10 as-text-center as-body-1"
            :class="{
              'as-caret-white as-text-on-surface': !isCustomError && !customRate,
              'as-caret-black as-text-on-primary': !isCustomError && customRate,
              'as-bg-error as-text-on-error': isCustomError,
            }"
            placeholder="?.?"
            :value="customRate"
            @input="onChangeCustom"
            @blur="onBlurCustom()"
          />
        </raised-container>
      </div>
    </div>
    <div v-if="isCustomError" class="as-body-2 as-text-error as-mt-2">Custom speeds: 0.5 - 4</div>
  </div>
</template>

<script lang="ts" setup>
import { PlaybackRate, PLAYBACK_SPEEDS } from '../utils';
import { useGeneralPreferences, useUpdateLocalPref } from '../state/useGeneralPreferences';
import { RaisedContainer, Icon } from '@anime-skip/ui';

const props = defineProps<{
  showLess?: boolean;
}>();

onMounted(() => {
  if (!isConstantSelected.value) {
    customRate.value = String(playbackRate.value);
  }
});

const updateNumberPref = useUpdateLocalPref<number>();
const changePlaybackRate = (newRate: number) => updateNumberPref('playbackRate', newRate);
const generalPrefs = useGeneralPreferences();
const playbackRate = computed(() => generalPrefs.value.playbackRate);

const customRate = ref('');
const playbackSpeeds = PLAYBACK_SPEEDS.filter(speed => !speed.hideWhenSmall || !props.showLess);

watch(
  () => generalPrefs.value.playbackRate,
  newRate => {
    if (!isConstantSelected.value) {
      customRate.value = newRate ? String(newRate) : '';
    }
  }
);

const isConstantSelected = computed(
  () => !!playbackSpeeds.find((speed: PlaybackRate) => speed.value === playbackRate.value)
);
const isCustomError = computed(() => {
  if (!customRate.value) return false;

  const value = Number(customRate.value);
  if (!isFinite(value)) return true;

  return value < 0.5 || value > 4;
});

function isRateSelected(speed: number): boolean {
  return playbackRate.value === speed && !customRate.value;
}

function onClickOption(value: number) {
  customRate.value = '';
  changePlaybackRate(Number(value));
}

function onChangeCustom(event: Event) {
  const { value } = event.target as HTMLInputElement;
  customRate.value = value;
}

function onBlurCustom() {
  const value = customRate.value;
  changePlaybackRate(Number(value));
  if (isConstantSelected.value) {
    customRate.value = '';
  }
  if (isCustomError.value) {
    return;
  }
}
</script>

<style scoped>
.as-caret-white {
  caret-color: white;
}

.as-caret-black {
  caret-color: black;
}

input {
  min-width: 0 !important;
}
input::placeholder {
  @apply as-text-on-surface !important;
}

.as-min-w-10 {
  flex-basis: 2.5rem;
}
</style>
