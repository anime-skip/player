import { useTimeoutFn } from '@vueuse/core';
import { log } from '~/common/utils/log';
import UsageStats from '~/common/utils/UsageStats';
import {
  useIncrementPlayTicks,
  usePlayHistory,
  useUpdatePlayHistory,
} from '../state/usePlayHistory';
import { useVideoController, useVideoState } from '../state/useVideoState';
import { useTabUrl } from './useTabUrl';

/**
 * Some player's don't actually start playing right after the "playing" event fires. instead, they
 * hang for a little bit, fire the "playing" event again, and then start playing. This value should
 * be set to a safe number of milliseconds above how long it usually takes between the two "playing"
 * events.
 *
 * With this extra timeout, the buffering spinner will not flash in and out multiple times, instead
 * being nice and smooth showing while not playing, and hiding once actual playback has started
 */
const onPlayingDelayMs: Record<Service, number> = {
  vrv: 50,
  funimation: 0,
  'funimation-2021-09-26': 0,
  'test-service': 0,
  crunchyroll: 100,
};

export function useVideoElement() {
  const videoState = useVideoState();
  const controls = useVideoController();
  const updatePlayHistory = useUpdatePlayHistory();
  const incrementPlayTicks = useIncrementPlayTicks();
  const playHistory = usePlayHistory();
  const video = ref(window.getVideo?.());
  const url = useTabUrl();

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

  const onPlayingDelayed = useTimeoutFn(controls.play, onPlayingDelayMs[window.service]);
  const onPlaying = () => {
    if (playHistory.isInitialBuffer && videoState.duration) {
      let service: ReportableService = window.service;
      if (
        service === 'crunchyroll' &&
        url.value &&
        new URL(url.value).hostname.startsWith('beta')
      ) {
        service = 'crunchyroll-beta';
      }
      void UsageStats.saveEvent('episode_started', {
        episodeDuration: videoState.duration,
        service: service,
      });
    }

    onPlayingDelayed.stop();
    onPlayingDelayed.start();
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
  };

  watch(
    () => videoState.isPaused,
    newIsPaused => {
      console.log('[video-state] isPaused=' + newIsPaused);
      if (!video.value) return;

      if (newIsPaused && !video.value.paused) video.value.pause();
      else if (!newIsPaused && video.value.paused) video.value.play();
    }
  );

  watch(
    () => videoState.isBuffering,
    newIsBuffering => {
      console.log('[video-state] isBuffering=' + newIsBuffering);
    }
  );

  watch(
    () => videoState.playbackRate,
    newPlaybackRate => {
      console.log('[video-state] playbackRate=' + newPlaybackRate);
      if (!video.value) return;

      video.value.playbackRate = newPlaybackRate;
    }
  );

  watch(
    () => videoState.volumePercent,
    newVolumePercent => {
      console.log('[video-state] volumePercent=' + newVolumePercent);
      if (!video.value) return;

      video.value.volume = newVolumePercent / 100;
    }
  );

  // Muted has no video listener
  watch(
    () => videoState.isMuted,
    newIsMuted => {
      console.log('[video-state] isMuted=' + newIsMuted);
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

    video.addEventListener('loadeddata', () =>
      console.log('[video-element] loadeddata', Date.now())
    );
    video.addEventListener('loadedmetadata', () =>
      console.log('[video-element] loadedmetadata', Date.now())
    );
    video.addEventListener('playing', () => console.log('[video-element] playing', Date.now()));
    video.addEventListener('waiting', () => console.log('[video-element] waiting', Date.now()));
    video.addEventListener('play', () => console.log('[video-element] play', Date.now()));
    video.addEventListener('pause', () => console.log('[video-element] pause', Date.now()));
    video.addEventListener('canplay', () => console.log('[video-element] canplay', Date.now()));
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
  window.onVideoChanged(newVideo => {
    if (video.value) clearListeners(video.value);
    setListeners(newVideo);
    video.value = newVideo;
    syncStartupState();
  });

  // Sync on startup if player is loaded into existing page on install
  syncStartupState();

  return { video, ...controls };
}
