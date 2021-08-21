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
      <div v-for="speed in rates" :key="speed.value" class="flex-1 min-w-10">
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
            v-model="customRate"
            @blur="onBlurCustom()"
          />
        </RaisedContainer>
      </div>
    </div>
    <div v-if="isCustomError" class="body-2 text-error mt-2">Custom speeds: 0.5 - 4</div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { PLAYBACK_SPEEDS } from '~/common/utils/Constants';
import { useGeneralPreferences, useUpdateNumberPref } from '../state/useGeneralPreferences';

const props = defineProps<{
  showLess?: boolean;
}>();

const { preferences } = useGeneralPreferences();
const rate = computed(() => preferences.value.playbackRate);
watch(rate, newRate => {
  if (isConstantSelected.value) {
    customRate.value = String(newRate);
  }
});

const customRate = ref('');
const rates = PLAYBACK_SPEEDS.filter(speed => !props.showLess || !speed.hideWhenSmall);
const isConstantSelected = computed(
  () => !!rates.find((speed: PlaybackRate) => speed.value === rate.value)
);
const isCustomError = computed(() => {
  if (!customRate.value) return false;

  const value = Number(customRate.value);
  if (!isFinite(value)) return true;

  return value < 0.5 || value > 4;
});

onMounted(() => {
  if (!isConstantSelected.value) {
    customRate.value = String(rate.value);
  }
});

// Selecting

function isRateSelected(speed: number): boolean {
  return rate.value === speed && !customRate.value;
}

const updateNumberPref = useUpdateNumberPref();
function updateRate(newRate: number): void {
  updateNumberPref('playbackRate', newRate);
}

function onClickOption(value: number): void {
  customRate.value = '';
  updateRate(value);
}

function onBlurCustom(): void {
  const value = customRate.value;
  updateRate(Number(value));
  if (isConstantSelected.value) {
    customRate.value = '';
  }
  if (isCustomError.value) {
    return;
  }
}
</script>

<script lang="ts">
defineComponent({
  methods: {},
});
</script>

<style scoped>
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
