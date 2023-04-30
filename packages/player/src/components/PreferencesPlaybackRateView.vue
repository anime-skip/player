<script lang="ts" setup>
import { PreferencesPlaybackRateView } from '../utils/preferences';

const props = defineProps<{
  view: PreferencesPlaybackRateView;
}>();

const video = useVideoElement();

const { pref } = usePreference(props.view.preferenceKey, props.view.isLocal);

const playbackRate = computed({
  get() {
    return pref.value ?? video.value.playbackRate;
  },
  set(newRate) {
    // Sometimes it's an empty string?
    if (!newRate) return;

    pref.value = newRate;
  },
});
</script>

<template>
  <div class="form-control">
    <div class="input-group">
      <span class="shrink-0">Playback Rate</span>
      <input
        type="number"
        class="input input-bordered focus:input-primary min-w-0 w-full"
        step="0.25"
        min="0.25"
        max="4"
        v-model="playbackRate"
      />
    </div>
  </div>
</template>
