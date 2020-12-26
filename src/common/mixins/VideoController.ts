import { defineComponent } from 'vue';
import Utils from '../utils/Utils';

export default defineComponent({
  created(): void {
    global.onVideoChanged(video => {
      this.isMuted = video.muted;
      this.volume = this.isMuted ? 0 : video.volume;
    });
  },
  beforeUnmount(): void {
    global.getVideo().removeEventListener('volumechange', this.onIgnoredVolumeChange);
  },
  data() {
    return {
      isMuted: !!global.getVideo().muted,
      volume: global.getVideo().volume,
      beforeMuteVolume: 0,
    };
  },
  methods: {
    togglePlayPause(): void {
      const video = global.getVideo();
      video.paused ? video.play() : video.pause();
    },
    play(): void {
      global.getVideo().play();
    },
    pause(): void {
      global.getVideo().pause();
      // TODO - #85
      // if (global.service === 'funimation') {
      //   setTimeout(() => {
      //     console.debug('[Funimation] secondary pause');
      //     global.getVideo().pause();
      //   }, 10);
      // }
    },
    addTime(seconds: number): void {
      const video = global.getVideo();
      video.currentTime = Utils.boundedNumber(video.currentTime + seconds, [0, video.duration]);
    },
    setCurrentTime(seconds: number): void {
      const video = global.getVideo();
      video.currentTime = Utils.boundedNumber(seconds, [0, video.duration]);
    },
    getCurrentTime(): number {
      return global.getVideo().currentTime;
    },
    videoMuted(): boolean {
      return global.getVideo().muted;
    },
    setMuted(isMuted: boolean) {
      this.isMuted = isMuted;
      global.getVideo().muted = isMuted;

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
      global.getVideo().volume = newVolume;

      if (!bypassMuteLogic && this.isMuted) {
        this.isMuted = false;
        global.getVideo().muted = false;
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
      const video: HTMLVideoElement | undefined = global.getVideo();
      if (!video?.muted && video?.volume === this.volume) return;
      console.debug(`Ignoring volume change event, reset to ${this.volume}`);
      global.getVideo().volume = this.volume;
    },
  },
});

export function useVideoController() {
  const setCurrentTime = (seconds: number) => {
    const video = global.getVideo();
    video.currentTime = Utils.boundedNumber(seconds, [0, video.duration]);
  };
  const pause = () => {
    const video = global.getVideo();
    video.paused ? video.play() : video.pause();
  };
  const togglePlayPause = () => {
    const video = global.getVideo();
    video.paused ? video.play() : video.pause();
  };
  const addTime = (seconds: number) => {
    const video = global.getVideo();
    video.currentTime = Utils.boundedNumber(video.currentTime + seconds, [0, video.duration]);
  };

  return {
    setCurrentTime,
    pause,
    togglePlayPause,
    addTime,
  };
}
