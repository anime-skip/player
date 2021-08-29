<template>
  <div class="PlaybackRatePicker">
    <div
      class="
        flex
        items-stretch
        justify-items-stretch
        h-10
        w-full
        divide-x-2 divide-background
        rounded-sm
        bg-control
      "
    >
      <Icon path="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z" class="my-2 w-10" />
      <div v-for="speed in playbackSpeeds" :key="speed.value" class="flex-1 min-w-10">
        <RaisedContainer
          class="cursor-pointer text-on-surface box-border w-full h-full"
          :down="!isRateSelected(speed.value)"
          :dark="!isRateSelected(speed.value)"
          @click="onClickOption(speed.value)"
        >
          <span
            class="transition-colors body-1"
            :class="{ 'text-on-primary': isRateSelected(speed.value) }"
            >{{ speed.display }}</span
          >
        </RaisedContainer>
      </div>
      <div class="flex-1 min-w-10 box-border">
        <RaisedContainer
          :down="!customRate"
          :dark="!customRate"
          :error="isCustomError"
          class="w-full p-0"
          :tabindex="-1"
        >
          <input
            type="text"
            step="0.01"
            :maxlength="4"
            class="bg-transparent w-full h-10 text-center body-1"
            :class="{
              'caret-white': !isCustomError,
              'bg-error text-on-error': isCustomError,
            }"
            placeholder="?.?"
            :value="customRate"
            @input="onChangeCustom"
            @blur="onBlurCustom()"
          />
        </RaisedContainer>
      </div>
    </div>
    <div v-if="isCustomError" class="body-2 text-error mt-2">Custom speeds: 0.5 - 4</div>
  </div>
</template>

<script lang="ts" setup>
import { PLAYBACK_SPEEDS } from '~/common/utils/Constants';
import { useGeneralPreferences, useUpdateNumberPref } from '../state/useGeneralPreferences';

// TODO-REQ test

const props = defineProps<{
  showLess: boolean;
}>();

onMounted(() => {
  if (!isConstantSelected.value) {
    customRate.value = String(playbackRate.value);
  }
});

const updateNumberPref = useUpdateNumberPref();
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

<style lang="scss" scoped>
.bg-transparent {
  background: transparent;
}

.caret-white {
  caret-color: white;
}

input {
  min-width: 0 !important;
}

.min-w-10 {
  flex-basis: 2.5rem;
}
</style>
