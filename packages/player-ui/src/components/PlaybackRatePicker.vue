<template>
  <div class="PlaybackRatePicker">
    <div
      class="as-flex as-items-stretch as-justify-items-stretch as-h-10 as-w-full as-divide-x-2 as-divide-background as-rounded-sm as-bg-control"
    >
      <div class="as-p-2 as-flex-shrink-0">
        <i-mdi-fast-forward class="as-w-6 as-h-6" />
      </div>
      <div v-for="speed in playbackSpeeds" :key="speed.value" class="as-flex-1 as-min-w-10">
        <RaisedContainer
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
        </RaisedContainer>
      </div>
      <div class="as-flex-grow as-flex-shrink-0 as-w-10 as-box-border">
        <RaisedContainer
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
        </RaisedContainer>
      </div>
    </div>
    <div v-if="isCustomError" class="as-body-2 as-text-error as-mt-2">Custom speeds: 0.5 - 4</div>
  </div>
</template>

<script lang="ts" setup>
import { PLAYBACK_SPEEDS } from '../utils/constants';
import { PlaybackRate } from 'common/src/types';
import { usePreferencesStore } from '../state/stores/usePreferencesStore';
import { storeToRefs } from 'pinia';
import { useSavePreferencesMutation } from '../state/composables/useSavePreferencesMutation';

const props = defineProps<{
  showLess: boolean;
}>();

onMounted(() => {
  if (!isConstantSelected.value) {
    customRate.value = String(playbackRate.value);
  }
});

const prefsStore = usePreferencesStore();
const { preferences } = storeToRefs(prefsStore);

const { mutate: savePref } = useSavePreferencesMutation();

const changePlaybackRate = (newRate: number) => savePref({ playbackRate: newRate });
const playbackRate = computed(() => preferences.value.playbackRate);

const customRate = ref('');
const playbackSpeeds = PLAYBACK_SPEEDS.filter(speed => !speed.hideWhenSmall || !props.showLess);

watch(
  () => preferences.value.playbackRate,
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
