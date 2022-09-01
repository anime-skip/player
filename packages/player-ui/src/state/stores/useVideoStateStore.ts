import { clamp, useEventListener, useMediaControls } from '@vueuse/core';
import { defineStore, storeToRefs } from 'pinia';
import { usePlayerConfig } from '../../composables/usePlayerConfig';
import { usePreferencesStore } from './usePreferencesStore';

export const useVideoStateStore = defineStore('video-state', () => {
  const config = usePlayerConfig();
  const { preferences } = storeToRefs(usePreferencesStore());

  const video = ref(config.getVideo());

  const media = useMediaControls(video);

  /**
   * media.duration doesn't really work, so we need to set and manage it manually.
   */
  function updateDuration() {
    media.duration.value = video.value.duration ?? 0;
  }

  useEventListener(video, 'canplay', updateDuration);
  useEventListener(video, 'durationchange', updateDuration);
  updateDuration();

  function applyPlayerSettings() {
    media.rate.value = preferences.value.playbackRate;
  }

  applyPlayerSettings();
  config.onVideoChanged(newVideo => {
    video.value = newVideo;
    applyPlayerSettings();
  });

  // Sync the preferences playback rate with the video's actual rate
  const preferencesRate = computed(() => preferences.value.playbackRate);
  watch(
    preferencesRate,
    newRate => {
      media.rate.value = newRate;
    },
    { immediate: true }
  );

  return {
    ...media,
    paused: computed(() => !media.playing.value),
    /**
     * Play the video, or do nothing if it's already playing
     */
    play() {
      media.playing.value = true;
    },
    /**
     * Pause the video, or do nothing if it's already paused
     */
    pause() {
      media.playing.value = false;
    },
    /**
     * Play the video if it's paused, pause the video if it's playing
     */
    togglePlayPause() {
      media.playing.value = !media.playing.value;
    },
    /**
     * Change the speed at which the browser plays back the video.
     * - 0.5 for half speed
     * - 1 for regular speed
     * - 2 for double
     * - etc
     */
    setPlaybackRate(newRate: number) {
      media.rate.value = clamp(newRate, 0.25, 4);
    },
    /**
     * Change the video's volume.
     * - 1 for full volume
     * - 0.5 for half volume
     * - 0 for no volume
     */
    setVolume(intPercent: number) {
      media.volume.value = clamp(intPercent, 0, 1);
    },
    /**
     * Mute the audio. This is different than setting the volume to 0, because when you unmute, the
     * volume is restored.
     */
    mute() {
      media.muted.value = true;
    },
    /**
     * Unmute and restore the previous volume.
     */
    unmute() {
      media.muted.value = false;
    },
    /**
     * Mute the video when unmuted, and unmute when the video is muted.
     */
    toggleMute() {
      media.muted.value = !media.muted.value;
    },
    /**
     * Change the video's current playing time in seconds, NOT milliseconds.
     */
    seekTo(newTimeInS: number) {
      media.currentTime.value = clamp(newTimeInS, 0, media.duration.value);
    },
    /**
     * Rewinds the time to the nearest interval in seconds.
     */
    rewindToNearest(intervalInS: number) {
      const currentTime = media.currentTime.value;
      this.seekTo(currentTime - (currentTime % intervalInS));
    },
    /**
     * Move the video player's current time forward by an increment in seconds.
     */
    fastForward(incrementInS: number) {
      this.seekTo(media.currentTime.value + incrementInS);
    },
    /**
     * Move the video player's current time back by an increment in seconds.
     */
    rewind(incrementInS: number) {
      this.seekTo(media.currentTime.value - incrementInS);
    },
  };
});
