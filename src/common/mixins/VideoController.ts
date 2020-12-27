import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Store, store } from '../store';
import { MutationTypes } from '../store/mutationTypes';
import Utils from '../utils/Utils';

export default defineComponent({
  created(): void {
    global.onVideoChanged(video => {
      this.isMuted = video.muted;
      this.volume = this.isMuted ? 0 : video.volume;
    });
  },
  beforeUnmount(): void {
    this.getVideo().removeEventListener('volumechange', this.onIgnoredVolumeChange);
  },
  data() {
    return {
      isMuted: !!global.getVideo!().muted,
      volume: global.getVideo!().volume,
      beforeMuteVolume: 0,
    };
  },
  computed: {
    currentTime(): number {
      return this.$store.state.playerState.currentTime;
    },
  },
  methods: {
    getVideo(): HTMLVideoElement {
      return global.getVideo!();
    },
    togglePlayPause(): void {
      const video = this.getVideo();
      video?.paused ? video.play() : video?.pause();
    },
    play(): void {
      this.getVideo().play();
    },
    pause(): void {
      this.getVideo().pause();
      // TODO - #85
      // if (global.service === 'funimation') {
      //   setTimeout(() => {
      //     console.debug('[Funimation] secondary pause');
      //     this.getVideo().pause();
      //   }, 10);
      // }
    },
    addTime(seconds: number): void {
      this.setCurrentTime(this.currentTime + seconds);
    },
    setCurrentTime(seconds: number, updateVideo = true): void {
      const video = this.getVideo();
      if (video == null) return;

      const bounded = Utils.boundedNumber(seconds, [0, video.duration]);
      store.commit(MutationTypes.SET_CURRENT_TIME, bounded);
      if (updateVideo) {
        video.currentTime = bounded;
      }
    },
    getCurrentTime(): number {
      return this.getVideo().currentTime ?? 0;
    },
    videoMuted(): boolean {
      return this.getVideo().muted ?? false;
    },
    setMuted(isMuted: boolean) {
      this.isMuted = isMuted;
      this.getVideo().muted = isMuted;

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
      this.getVideo().volume = newVolume;

      if (!bypassMuteLogic && this.isMuted) {
        this.isMuted = false;
        this.getVideo().muted = false;
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
      global.onVideoChanged(video => {
        video.addEventListener('volumechange', this.onIgnoredVolumeChange);
      });
    },
    onIgnoredVolumeChange(): void {
      const video: HTMLVideoElement | undefined = this.getVideo();
      if (!video?.muted && video?.volume === this.volume) return;
      console.debug(`Ignoring volume change event, reset to ${this.volume}`);
      this.getVideo().volume = this.volume;
    },
  },
});

export function useVideoController(store: Store = useStore()) {
  const currentTime = computed(() => store.state.playerState.currentTime);
  const getVideo = (): HTMLVideoElement => global.getVideo!();
  const setCurrentTime = (seconds: number, updateVideo = true) => {
    const video = getVideo();
    const bounded = Utils.boundedNumber(seconds, [0, video.duration]);
    store.commit(MutationTypes.SET_CURRENT_TIME, bounded);
    if (updateVideo) {
      video.currentTime = bounded;
    }
  };
  const pause = () => {
    const video = getVideo();
    video.paused ? video.play() : video.pause();
  };
  const togglePlayPause = () => {
    const video = getVideo();
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
    getVideo,
  };
}
