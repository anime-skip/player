import { createSharedComposable } from '~/common/hooks/createSharedComposable';
import {
  useIncrementPlayTicks,
  usePlayHistory,
  useUpdatePlayHistory,
} from '../state/usePlayHistory';
import { useVideoController, useVideoState } from '../state/useVideoState';
import { areNumbersWithin } from '../utils/areNumbersWithin';

export const useVideoElement = createSharedComposable(function () {
  const videoState = useVideoState();
  const controls = useVideoController();
  const updatePlayHistory = useUpdatePlayHistory();
  const incrementPlayTicks = useIncrementPlayTicks();
  const playHistory = usePlayHistory();
  const video = ref(window.getVideo?.());

  // Reactive - the video can change this state, and we can change the video

  const updateDuration = () => controls.setDuration(video.value?.duration);
  const clearBuffering = () => {
    controls.clearBuffering();
    updatePlayHistory({ isInitialBuffer: false });
  };
  const updateCurrentTime = () => {
    const newTime = video.value?.currentTime ?? 0;
    controls.setCurrentTime(newTime, false);
    incrementPlayTicks();
  };
  const setBuffering = () => controls.buffering();

  // Enforced - the video element will be reverted if it changes away from what we specify

  const enforcePlayPause = () => {
    if (!video.value) return;

    // respect the player for the first couple of time updates
    if (playHistory.playTicks < 2) {
      if (video.value.paused) controls.pause();
      else controls.play();
      return;
    }

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
      video.value.volume = videoState.playbackRate;
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

    const newVolume = video.value.volume * 100;
    const closeToAllowedChange =
      videoState.allowVolumeChangeTo != null &&
      areNumbersWithin(newVolume, videoState.allowVolumeChangeTo, 1);
    if (!closeToAllowedChange) {
      console.log('Enforced volume at', videoState.volumePercent);
      video.value.volume = videoState.volumePercent / 100;
    } else {
      controls.clearVolumeChange();
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
