import { useTimeoutFn } from '@vueuse/core';
import { Ref } from 'vue';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import {
  useIncrementPlayTicks,
  usePlayHistory,
  useUpdatePlayHistory,
} from '../stores/usePlayHistory';
import { useVideoController, useVideoState } from '../stores/useVideoState';
import { log } from '~/utils/log';
import UsageStats from '~/utils/UsageStats';
import { useTabUrl } from './useTabUrl';

export function useVideoElement() {
  const videoState = useVideoState();
  const controls = useVideoController();
  const updatePlayHistory = useUpdatePlayHistory();
  const incrementPlayTicks = useIncrementPlayTicks();
  const playHistory = usePlayHistory();
  const { service, getVideo, onVideoChanged, onPlayDebounceMs } = usePlayerConfig();
  const video = ref(getVideo?.()) as Ref<HTMLVideoElement | undefined>;
  const url = useTabUrl();
  const canPlayCalled = ref(false);

  // Reactive - the video can change this state, and we can change the video

  function syncStartupState() {
    if (!video.value) return;

    log('Applying startup video state:', {
      isMutedState: videoState.isMuted,
      isMutedVideo: video.value.muted,
      volumePercent: videoState.volumePercent,
      playbackRate: videoState.playbackRate,
      paused: video.value.paused,
    });

    restoreMute(video.value);
    video.value.volume = videoState.volumePercent / 100;
    video.value.playbackRate = videoState.playbackRate;
    video.value.paused ? controls.pause() : controls.play();
  }

  function restoreMute(video: HTMLVideoElement) {
    // Store as variables because video.value.muted is can be changed as the result of shouldMuteVideo
    const shouldMuteVideo = videoState.isMuted;
    const shouldShowAsMuted = video.muted;

    if (shouldMuteVideo) video.muted = videoState.isMuted;
    if (shouldShowAsMuted) controls.mute();
  }

  function updateDuration() {
    controls.setDuration(video.value?.duration);
  }

  function updateCurrentTime() {
    const newTime = video.value?.currentTime ?? 0;
    controls.setCurrentTime(newTime, false);
    if (video.value && !video.value.paused) {
      controls.clearBuffering();
    }
    incrementPlayTicks();
  }

  const onDurationChange = () => updateDuration();
  const onLoadedMetadata = () => {
    updateDuration();
  };
  const onLoadedData = () => {
    updateCurrentTime();
  };

  const onPlayingDelayed = useTimeoutFn(controls.play, onPlayDebounceMs);
  const onPlaying = () => {
    if (playHistory.isInitialBuffer && videoState.duration) {
      let reportedService = service;
      if (
        service === 'crunchyroll' &&
        url.value &&
        new URL(url.value).hostname.startsWith('beta')
      ) {
        reportedService = 'crunchyroll-beta';
      }
      void UsageStats.saveEvent('episode_started', {
        episodeDuration: videoState.duration,
        service: reportedService,
      });
    }

    onPlayingDelayed.stop();
    onPlayingDelayed.start();

    // When the `canplay` event fires before we've added our event listener, we need to call it
    // manually
    if (!canPlayCalled.value) {
      onCanPlay();
    }
  };
  const onTimeUpdate = () => {
    updateCurrentTime();
  };
  const onWaiting = () => {
    onPlayingDelayed.stop();
    controls.buffering();
  };
  const onCanPlay = () => {
    syncStartupState();
    controls.clearBuffering();
    updatePlayHistory({ isInitialBuffer: false });
    canPlayCalled.value = true;
  };

  watch(
    () => videoState.isPaused,
    newIsPaused => {
      if (!video.value) return;

      if (newIsPaused && !video.value.paused) video.value.pause();
      else if (!newIsPaused && video.value.paused) video.value.play();
    }
  );

  watch(
    () => videoState.playbackRate,
    newPlaybackRate => {
      if (!video.value) return;

      video.value.playbackRate = newPlaybackRate;
    }
  );

  watch(
    () => videoState.volumePercent,
    newVolumePercent => {
      if (!video.value) return;

      video.value.volume = newVolumePercent / 100;
    }
  );

  // Muted has no video listener
  watch(
    () => videoState.isMuted,
    newIsMuted => {
      if (video.value) video.value.muted = newIsMuted;
    }
  );

  const onEnded = () => {
    if (videoState.duration) {
      void UsageStats.saveEvent('episode_finished', { episodeDuration: videoState.duration });
    }
  };

  const setListeners = (video: HTMLVideoElement) => {
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('ended', onEnded);
  };
  const clearListeners = (video: HTMLVideoElement) => {
    video.removeEventListener('durationchange', onDurationChange);
    video.removeEventListener('loadedmetadata', onLoadedMetadata);
    video.removeEventListener('loadeddata', onLoadedData);
    video.removeEventListener('canplay', onCanPlay);
    video.removeEventListener('playing', onPlaying);
    video.removeEventListener('timeupdate', onTimeUpdate);
    video.removeEventListener('waiting', onWaiting);
    video.removeEventListener('ended', onEnded);
  };
  onVideoChanged(newVideo => {
    if (video.value) clearListeners(video.value);
    setListeners(newVideo);
    video.value = newVideo;
    syncStartupState();
  });

  // Sync on startup if player is loaded into existing page on install
  syncStartupState();

  return { video, ...controls };
}
