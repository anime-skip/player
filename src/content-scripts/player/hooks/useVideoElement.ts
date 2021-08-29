import { Utils as UiUtils } from '@anime-skip/ui';
import { createSharedComposable } from '~/common/hooks/createSharedComposable';
import { useUpdatePlayHistory } from '../state/usePlayHistory';
import { useVideoController, useVideoState } from '../state/useVideoState';
import { areNumbersWithin } from '../utils/areNumbersWithin';

export const useVideoElement = createSharedComposable(function () {
  const videoState = useVideoState();
  const controls = useVideoController();
  const updatePlayHistory = useUpdatePlayHistory();
  const video = ref(window.getVideo?.());

  // Reactive - the video can change this state, and we can change the video

  const updateDuration = () => controls.setDuration(video.value?.duration);
  const clearBuffering = () => {
    controls.clearBuffering();
    updatePlayHistory({ isInitialBuffer: false });
  };
  const updateCurrentTime = () => {
    const newTime = video.value?.currentTime ?? 0;
    if (videoState.currentTime !== newTime) controls.setCurrentTime(newTime, false);
  };
  // watch(
  //   () => videoState.currentTime,
  //   newCurrentTime => {
  //     if (video.value) video.value.currentTime = newCurrentTime;
  //   }
  // );
  const setBuffering = () => controls.buffering();

  // Enforced - the video element will be reverted if it changes away from what we specify

  const enforcePlayPause = () => {
    if (!video.value) return;

    if (video.value.paused !== videoState.isPaused) {
      if (videoState.isPaused) video.value.pause();
      else video.value.play();
      console.log('Enforced paused', videoState.isPaused);
    }
  };
  watch(
    () => videoState.isPaused,
    newIsPaused => {
      if (!video.value) return;

      if (newIsPaused) video.value.pause();
      else video.value.play();
    }
  );

  const enforceRateChange = () => {
    if (!video.value) return;

    if (video.value.volume !== videoState.playbackRate) {
      video.value.volume = UiUtils.boundedNumber(videoState.playbackRate, [0, 1]);
      console.log('Enforced playback rate at', videoState.playbackRate);
    }
  };
  watch(
    () => videoState.playbackRate,
    newPlaybackRate => {
      if (!video.value) return;

      video.value.playbackRate = newPlaybackRate;
    }
  );

  const enforceVolumeChange = () => {
    if (!video.value) return;

    if (!areNumbersWithin(video.value.volume * 100, videoState.volumePercent, 0.01)) {
      console.log('Enforced volume at', videoState.volumePercent);
      video.value.volume = videoState.volumePercent / 100;
    }
  };
  watch(
    () => videoState.volumePercent,
    newVolumePercent => {
      if (!video.value) return;

      video.value.volume = newVolumePercent / 100;
    }
  );

  // Muted has not video listener
  watch(
    () => videoState.isMuted,
    newIsMuted => {
      if (video.value) video.value.muted = newIsMuted;
    }
  );

  const setListeners = (video: HTMLVideoElement) => {
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', enforcePlayPause);
    video.addEventListener('playing', clearBuffering);
    video.addEventListener('pause', enforcePlayPause);
    video.addEventListener('ratechange', enforceRateChange);
    video.addEventListener('timeupdate', updateCurrentTime);
    video.addEventListener('volumechange', enforceVolumeChange);
    video.addEventListener('waiting', setBuffering);
  };
  const clearListeners = (video: HTMLVideoElement) => {
    video.removeEventListener('durationchange', updateDuration);
    video.removeEventListener('loadedmetadata', updateDuration);
    video.removeEventListener('play', enforcePlayPause);
    video.removeEventListener('playing', clearBuffering);
    video.removeEventListener('pause', enforcePlayPause);
    video.removeEventListener('ratechange', enforceRateChange);
    video.removeEventListener('timeupdate', updateCurrentTime);
    video.removeEventListener('volumechange', enforceVolumeChange);
    video.removeEventListener('waiting', setBuffering);
  };
  window.onVideoChanged(newVideo => {
    if (video.value) clearListeners(video.value);
    setListeners(newVideo);
    video.value = newVideo;
  });

  return { video, ...controls };
});
