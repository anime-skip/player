import { createSharedComposable } from '~/common/hooks/createSharedComposable';
import { useVideoController } from '../state/useVideoState';

export const useVideoElement = createSharedComposable(function () {
  const controls = useVideoController();
  const video = ref(window.getVideo?.());

  const durationChange = () => controls.setDuration(video.value?.duration);
  const loadedMetadata = () => controls.setDuration(video.value?.duration);
  const play = () => controls.play();
  const playing = () => controls.clearBuffering();
  const pause = () => controls.pause();
  const rateChange = () => controls.setPlaybackRate(video.value?.playbackRate ?? 1);
  const timeUpdate = () => controls.setCurrentTime(video.value?.currentTime ?? 0);
  const volumeChange = () => controls.setVolumePercent(video.value?.volume ?? 100);
  const waiting = () => controls.buffering();

  const setListeners = (video: HTMLVideoElement) => {
    video.addEventListener('durationchange', durationChange);
    video.addEventListener('loadedmetadata', loadedMetadata);
    video.addEventListener('play', play);
    video.addEventListener('playing', playing);
    video.addEventListener('pause', pause);
    video.addEventListener('ratechange', rateChange); // TODO: Do we want to accept to this, or just use our own playback rate
    video.addEventListener('timeupdate', timeUpdate);
    video.addEventListener('volumechange', volumeChange);
    video.addEventListener('waiting', waiting);
  };
  const clearListeners = (video: HTMLVideoElement) => {
    video.removeEventListener('durationchange', durationChange);
    video.removeEventListener('loadedmetadata', loadedMetadata);
    video.removeEventListener('play', play);
    video.removeEventListener('playing', playing);
    video.removeEventListener('pause', pause);
    video.removeEventListener('ratechange', rateChange);
    video.removeEventListener('timeupdate', timeUpdate);
    video.removeEventListener('volumechange', volumeChange);
    video.removeEventListener('waiting', waiting);
  };
  window.onVideoChanged(newVideo => {
    if (video.value) clearListeners(video.value);
    setListeners(newVideo);
    video.value = newVideo;
  });

  return { video, ...controls };
});
