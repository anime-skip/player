import UsageStats from '~/common/utils/UsageStats';
import {
  useIncrementPlayTicks,
  usePlayHistory,
  useUpdatePlayHistory,
} from '../state/usePlayHistory';
import { useVideoController, useVideoState } from '../state/useVideoState';

export function useVideoElement() {
  const videoState = useVideoState();
  const controls = useVideoController();
  const updatePlayHistory = useUpdatePlayHistory();
  const incrementPlayTicks = useIncrementPlayTicks();
  const playHistory = usePlayHistory();
  const video = ref(window.getVideo?.());

  // Reactive - the video can change this state, and we can change the video

  const updateDuration = () => controls.setDuration(video.value?.duration);
  const initialLoad = () => {
    updateDuration();
    updateCurrentTime();
  };
  const startedPlaying = () => {
    if (playHistory.isInitialBuffer && videoState.duration) {
      void UsageStats.saveEvent('episode_started', { episodeDuration: videoState.duration });
    }
    controls.clearBuffering();
    updatePlayHistory({ isInitialBuffer: false });
    if (video.value && !video.value.paused) {
      controls.play();
    }
  };
  const updateCurrentTime = () => {
    const newTime = video.value?.currentTime ?? 0;
    controls.setCurrentTime(newTime, false);
    if (video.value && !video.value.paused) {
      controls.clearBuffering();
    }
    incrementPlayTicks();
  };
  const setBuffering = () => controls.buffering();

  watch(
    () => videoState.isPaused,
    newIsPaused => {
      if (!video.value) return;

      if (newIsPaused) video.value.pause();
      else video.value.play();
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

  // Muted has not video listener
  watch(
    () => videoState.isMuted,
    newIsMuted => {
      if (video.value) video.value.muted = newIsMuted;
    }
  );

  const onVideoEnded = () => {
    if (videoState.duration) {
      void UsageStats.saveEvent('episode_finished', { episodeDuration: videoState.duration });
    }
  };

  const setListeners = (video: HTMLVideoElement) => {
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('loadedmetadata', initialLoad);
    video.addEventListener('playing', startedPlaying);
    video.addEventListener('timeupdate', updateCurrentTime);
    video.addEventListener('waiting', setBuffering);
    video.addEventListener('ended', onVideoEnded);
  };
  const clearListeners = (video: HTMLVideoElement) => {
    video.removeEventListener('durationchange', updateDuration);
    video.removeEventListener('loadedmetadata', initialLoad);
    video.removeEventListener('playing', startedPlaying);
    video.removeEventListener('timeupdate', updateCurrentTime);
    video.removeEventListener('waiting', setBuffering);
    video.removeEventListener('ended', onVideoEnded);
  };
  window.onVideoChanged(newVideo => {
    if (video.value) clearListeners(video.value);
    setListeners(newVideo);
    video.value = newVideo;
    newVideo.playbackRate = videoState.playbackRate;
    newVideo.volume = videoState.volumePercent / 100;
  });

  return { video, ...controls };
}
