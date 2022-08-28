import { GeneralEventListener, useThrottle, useThrottleFn } from '@vueuse/core';
import isEqual from 'lodash.isequal';
import { defineStore, storeToRefs } from 'pinia';
import { Ref, UnwrapRef, WatchCallback } from 'vue';
import { usePlayerConfig } from '../../composables/usePlayerConfig';
import { debug, log } from '../../utils/log';
import { useUserActivityStore } from './useUserActivityStore';
import { usePlayHistoryStore } from './usePlayHistoryStore';
import { useTabUrlStore } from './useTabUrlStore';
import { usePreferencesStore } from './usePreferencesStore';

export enum VideoReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

function useVideoEventListener<EventType = Event>(
  target: Ref<EventTarget | null | undefined>,
  event: string,
  listener: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions
) {
  onMounted(() => {
    // @ts-expect-error: listener is wrong type
    target.value?.addEventListener(event, listener, options);
  });
  onUnmounted(() => {
    // @ts-expect-error: listener is wrong type
    target.value?.removeEventListener(event, listener, options);
  });
  watch(target, (newTarget, oldTarget) => {
    // @ts-expect-error: listener is wrong type
    oldTarget?.removeEventListener(event, listener, options);
    // @ts-expect-error: listener is wrong type
    newTarget?.addEventListener(event, listener, options);
  });
}

/**
 * This watch is used to break the recursive loop of calling a method on an HTMLVideoElement and
 * that method's corresponding event callback being triggered, which would set the source's value
 * again. By doing a deep comparison, we can NOT call the method again if nothing has changed.
 */
function watchDeepEqual<T>(source: Ref<T>, cb: WatchCallback<T>) {
  watch(source, (newValue, oldValue, onCleanup) => {
    if (isEqual(newValue, oldValue)) return;
    return cb(newValue, oldValue, onCleanup);
  });
}

export const useVideoStateStore = defineStore('video-state', () => {
  const config = usePlayerConfig();
  const playerActivity = useUserActivityStore();
  const playHistory = usePlayHistoryStore();
  const { url } = storeToRefs(useTabUrlStore());
  const { preferences } = storeToRefs(usePreferencesStore());

  // Video

  const video = ref(config.getVideo());
  config.onVideoChanged(newVideo => {
    video.value = newVideo;
    applyVideoState();
  });

  // State

  const isBuffering = ref(true);
  const isPaused = ref(video.value.paused);
  /**
   * The video's current playback time in seconds (NOT milliseconds)
   */
  const currentTime = ref();
  /**
   * The video's duration in seconds (NOT milliseconds)
   */
  const duration = ref(video.value.duration || 0);
  const volumeIntPercent = ref(100);
  const allowVolumeChangeTo = ref<number>();
  const isMuted = ref(video.value.muted);
  const playbackRate = ref(video.value.playbackRate);
  const canPlayEventTriggered = ref(false);

  // Events

  function reportEpisodeStarted() {
    let reportedService = config.service;
    if (
      config.service === 'crunchyroll' &&
      url.value &&
      new URL(url.value).hostname.startsWith('beta')
    ) {
      reportedService = 'crunchyroll-beta';
    }
    void config.usageClient.saveEvent('episode_started', {
      episodeDuration: duration.value,
      service: reportedService,
    });
  }

  /**
   * Update video with the current values from state, not waiting for the related events to fire.
   * Useful when initializing a new video to use the same settings as the previous one.
   */
  function applyVideoState() {
    debug('Applying video state to video element:', {
      stateIsMuted: isMuted.value,
      videoIsMuted: video.value.muted,
      stateVolumePercent: volumeIntPercent.value,
      videoVolumePercent: video.value.volume,
      statePlaybackRate: playbackRate.value,
      videoPlaybackRate: video.value.playbackRate,
      stateIsPaused: isPaused.value,
      videoIsPaused: video.value.paused,
    });

    video.value.muted = isMuted.value;
    video.value.volume = volumeIntPercent.value / 100;
    video.value.playbackRate = playbackRate.value;
    isPaused.value ? video.value.pause() : video.value.play();
  }

  function updateCurrentTimeState() {
    currentTime.value = video.value.currentTime || 0;
    if (!video.value.paused) {
      isBuffering.value = false;
    }
    playHistory.incrementPlayTicks();
  }

  function updateDurationState() {
    const newDuration = video.value.duration;
    if (isNaN(newDuration)) duration.value = 0;
    else duration.value = newDuration;
  }

  const updatePlayingState = useThrottleFn(
    () => {
      if (playHistory.isInitialBuffer && duration.value) reportEpisodeStarted();

      // When the `canplay` event fires before we've added our event listener, we need to call it
      // manually
      if (!canPlayEventTriggered.value) {
        video.value.dispatchEvent(new CustomEvent('canPlay'));
      }
    },
    config.onPlayDebounceMs,
    true
  );

  function updateWaitingState() {
    // updatePlayingState.stop() // TODO[state] - how can I stop this?
    isBuffering.value = true;
  }

  useVideoEventListener(video, 'playing', updatePlayingState);
  useVideoEventListener(video, 'canplay', () => {
    isBuffering.value = false;
    playHistory.isInitialBuffer = false;
    canPlayEventTriggered.value = true;
    applyVideoState();
  });
  useVideoEventListener(video, 'play', () => {
    isPaused.value = false;
    playerActivity.triggerActive();
  });
  useVideoEventListener(video, 'pause', () => {
    isPaused.value = true;
    playerActivity.triggerActive();
  });
  useVideoEventListener(video, 'durationchange', updateDurationState);
  useVideoEventListener(video, 'loadedmetadata', updateDurationState);
  useVideoEventListener(video, 'loadeddata', updateCurrentTimeState);
  useVideoEventListener(video, 'timeupdate', updateCurrentTimeState);
  useVideoEventListener(video, 'waiting', updateWaitingState);
  useVideoEventListener(video, 'ended', () => {
    void config.usageClient.saveEvent('episode_finished', { episodeDuration: duration.value });
    updateDurationState();
  });

  watchDeepEqual(isPaused, newIsPaused => {
    if (newIsPaused) video.value.pause();
    else video.value.play();
  });

  const playbackRatePref = computed(() => preferences.value.playbackRate);
  watchDeepEqual(playbackRatePref, newPlaybackRate => {
    playbackRate.value = newPlaybackRate;
  });

  // Sync on startup if player is loaded into existing page on install
  applyVideoState();

  return {
    isBuffering,
    isPaused,
    currentTime,
    duration,
    volumeIntPercent,
    allowVolumeChangeTo,
    isMuted,
    playbackRate,
  };
});
