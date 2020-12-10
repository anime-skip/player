import { defineComponent } from 'vue';
import Utils from '../utils/Utils';

export default defineComponent({
  created(): void {
    global.onVideoChanged(video => {
      video.onvolumechange = () => {
        this.level = this.isMuted ? 0 : video.volume;
      };
      this.isMuted = video.muted;
      this.level = this.isMuted ? 0 : video.volume;
    });
  },
  data() {
    return {
      isMuted: !!global.getVideo().muted,
      level: global.getVideo().volume,
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
      this.level = this.isMuted ? 0 : global.getVideo().volume;
      global.getVideo().muted = isMuted;
    },
    /**
     * @returns {number} A decimal value between [0-1]
     */
    videoVolumeLevel(): number {
      return global.getVideo().volume;
    },
    /**
     * @param volume A decimal value between [0-1]
     */
    setVolume(newVolume: number): void {
      global.getVideo().volume = newVolume;
    },
    toggleMuted() {
      this.setMuted(!this.isMuted);
    },
  },
});
