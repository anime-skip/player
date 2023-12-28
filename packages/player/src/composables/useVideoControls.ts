import { SECOND } from '../utils/time';

/**
 * Return an object containing the video element's current state as refs which can be set.
 */
export default createSharedComposable(() => {
  const video = useVideoElement();

  function getCurrentDuration() {
    const s = video.value.duration;
    if (!s || isNaN(s)) return undefined;
    return s;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

  const playing = ref(false);
  const playbackRate = ref(1);
  const volume = ref(1);
  const muted = ref(false);
  const seeking = ref(false);
  const currentTime = ref(0);
  const buffering = ref(false);
  const duration = ref<number>();

  function resetValues() {
    playing.value = !video.value.paused;
    playbackRate.value = video.value.playbackRate;
    volume.value = video.value.volume;
    muted.value = video.value.muted;
    seeking.value = video.value.seeking;
    currentTime.value = video.value.currentTime;
    buffering.value = true;
    duration.value = getCurrentDuration();
  }
  resetValues();
  watch(video, resetValues);

  // The durationchange event is fired when the duration attribute has been updated.
  useEventListener(video, 'durationchange', () => {
    duration.value = getCurrentDuration();
  });

  // The play event is fired when the paused property is changed from true to false, as a result of
  // the play method, or the autoplay attribute.
  useEventListener(video, 'play', () => {
    ignoreUpdatesPlaying(() => {
      playing.value = true;
    });
  });
  const { ignoreUpdates: ignoreUpdatesPlaying } = watchIgnorable(
    playing,
    (playing) => {
      if (playing) video.value.play();
      else video.value.pause();
    },
  );

  // The pause event is sent when a request to pause an activity is handled and the activity has
  // entered its paused state, most commonly after the media has been paused through a call to the
  // element's pause() method.
  useEventListener(video, 'pause', () => {
    ignoreUpdatesPlaying(() => {
      playing.value = false;
    });
  });

  // The playing event is fired after playback is first started, and whenever it is restarted. For
  // example it is fired when playback resumes after having been paused or delayed due to lack of
  // data.
  useEventListener(video, 'playing', () => {
    ignoreUpdatesPlaying(() => {
      playing.value = true;
    });
    buffering.value = false;
  });

  // The ended event is fired when playback or streaming has stopped because the end of the media
  // was reached or because no further data is available.
  useEventListener(video, 'ended', () => {
    playing.value = false;
  });

  // The waiting event is fired when playback has stopped because of a temporary lack of data.
  useEventListener(video, 'waiting', () => {
    buffering.value = true;
  });

  // The stalled event is fired when the user agent is trying to fetch media data, but data is
  // unexpectedly not forthcoming.
  useEventListener(video, 'stalled', () => {
    buffering.value = true;
  });

  // The suspend event is fired when media data loading has been suspended.
  useEventListener(video, 'suspend', () => {
    buffering.value = true;
  });

  // The ratechange event is fired when the playback rate has changed.
  useEventListener(video, 'ratechange', () => {
    ignoreUpdatesPlaybackRate(
      () => (playbackRate.value = video.value.playbackRate),
    );
  });
  const { ignoreUpdates: ignoreUpdatesPlaybackRate } = watchIgnorable(
    playbackRate,
    () => {
      video.value.playbackRate = playbackRate.value;
    },
  );

  // The seeked event is fired when a seek operation completed, the current playback position has
  // changed, and the Boolean seeking attribute is changed to false.
  useEventListener(video, 'seeked', () => {
    seeking.value = false;
  });

  // The seeking event is fired when a seek operation starts, meaning the Boolean seeking attribute
  // has changed to true and the media is seeking a new position.
  useEventListener(video, 'seeking', () => {
    seeking.value = true;
  });

  // The timeupdate event is fired when the time indicated by the currentTime attribute has been
  // updated.
  useEventListener(video, 'timeupdate', () => {
    ignoreUpdatesCurrentTime(
      () => (currentTime.value = video.value.currentTime),
    );
    buffering.value = false;
  });
  const { ignoreUpdates: ignoreUpdatesCurrentTime } = watchIgnorable(
    currentTime,
    () => {
      video.value.currentTime = currentTime.value;
    },
  );

  // The volumechange event is fired when the volume has changed.
  useEventListener(video, 'volumechange', () => {
    ignoreUpdatesVolume(() => (volume.value = video.value.volume));
  });
  const { ignoreUpdates: ignoreUpdatesVolume } = watchIgnorable(volume, () => {
    video.value.volume = volume.value;
  });
  watch(muted, () => {
    if (video.value.muted === muted.value) return;

    video.value.muted = muted.value;
  });

  return {
    playing,
    volume,
    muted,
    seeking,
    currentTime,
    playbackRate,
    buffering: readonly(useDebounce(buffering, 0.1 * SECOND)),
    duration: readonly(duration),
  };
});
