import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Store, store } from '../store';
import { MutationTypes } from '../store/mutationTypes';
import Utils from '../utils/Utils';

function getVideoOrThrow(): HTMLVideoElement {
  if (window.getVideo == null) {
    const message = 'Attempted to get video without setting a value for window.getVideo';
    console.log(message);
    throw new Error(message);
  }
  return window.getVideo();
}

export default defineComponent({
  created(): void {
    window.onVideoChanged(video => {
      this.isMuted = video.muted;
      this.volume = this.isMuted ? 0 : video.volume;
    });
  },
  beforeUnmount(): void {
    getVideoOrThrow().removeEventListener('volumechange', this.onIgnoredVolumeChange);
  },
  data() {
    return {
      isMuted: !!getVideoOrThrow().muted,
      volume: getVideoOrThrow().volume,
      beforeMuteVolume: 0,
    };
  },
  computed: {
    currentTime(): number {
      return this.$store.state.playerState.currentTime;
    },
  },
  methods: {
    togglePlayPause(): void {
      const video = getVideoOrThrow();
      video?.paused ? video.play() : video?.pause();
    },
    play(): void {
      getVideoOrThrow().play();
    },
    pause(): void {
      getVideoOrThrow().pause();
      // TODO - #85
      // if (window.service === 'funimation') {
      //   setTimeout(() => {
      //     console.debug('[Funimation] secondary pause');
      //     getVideoOrThrow().pause();
      //   }, 10);
      // }
    },
    addTime(seconds: number): void {
      this.setCurrentTime(this.currentTime + seconds);
    },
    setCurrentTime(seconds: number, updateVideo = true): void {
      const video = getVideoOrThrow();
      if (video == null) return;

      const bounded = Utils.boundedNumber(seconds, [0, video.duration]);
      store.commit(MutationTypes.SET_CURRENT_TIME, bounded);
      if (updateVideo) {
        video.currentTime = bounded;
      }
    },
    getCurrentTime(): number {
      return getVideoOrThrow().currentTime ?? 0;
    },
    videoMuted(): boolean {
      return getVideoOrThrow().muted ?? false;
    },
    setMuted(isMuted: boolean) {
      this.isMuted = isMuted;
      getVideoOrThrow().muted = isMuted;

      if (isMuted) {
        this.beforeMuteVolume = this.volume;
        this.setVolume(0, true);
      } else {
        this.setVolume(this.beforeMuteVolume, true);
        this.beforeMuteVolume = 0;
      }
    },
    /**
     * @param volume          A decimal value between [0-1]
     * @param bypassMuteLogic Skip un-muting of the video if necessary when true. This param is only
     *                        for use in the `setMuted` method
     */
    setVolume(newVolume: number, bypassMuteLogic = false): void {
      this.volume = newVolume;
      getVideoOrThrow().volume = newVolume;

      if (!bypassMuteLogic && this.isMuted) {
        this.isMuted = false;
        getVideoOrThrow().muted = false;
        this.beforeMuteVolume = 0;
      }
    },
    toggleMuted() {
      this.setMuted(!this.isMuted);
    },
    addVolume(decimalPercent: number): void {
      this.setVolume(Utils.boundedNumber(this.volume + decimalPercent, [0, 1]));
    },
    /**
     * If the volume changes unexpectedly, ignore the change and set it back to what it was before
     */
    setupVolumeOverrideManager(): void {
      window.onVideoChanged(video => {
        video.addEventListener('volumechange', this.onIgnoredVolumeChange);
      });
    },
    onIgnoredVolumeChange(): void {
      const video = getVideoOrThrow();
      if (!video?.muted && video?.volume === this.volume) return;
      console.debug(`Ignoring volume change event, reset to ${this.volume}`);
      video.volume = this.volume;
    },
  },
});

export function useVideoController(store: Store = useStore()) {
  const currentTime = computed(() => store.state.playerState.currentTime);
  const setCurrentTime = (seconds: number, updateVideo = true) => {
    const video = getVideoOrThrow();
    const bounded = Utils.boundedNumber(seconds, [0, video.duration]);
    store.commit(MutationTypes.SET_CURRENT_TIME, bounded);
    if (updateVideo) {
      video.currentTime = bounded;
    }
  };
  const pause = () => {
    const video = getVideoOrThrow();
    video.paused ? video.play() : video.pause();
  };
  const togglePlayPause = () => {
    const video = getVideoOrThrow();
    video.paused ? video.play() : video.pause();
  };
  const addTime = (seconds: number) => {
    setCurrentTime(currentTime.value + seconds);
  };

  return {
    setCurrentTime,
    pause,
    togglePlayPause,
    addTime,
    getVideoOrThrow,
  };
}
