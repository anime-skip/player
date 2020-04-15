import { Vue, Component } from 'vue-property-decorator';

@Component
export default class VideoControllerMixin extends Vue {
  created(): void {
    global.onVideoChanged(video => {
      video.onvolumechange = () => {
        this.level = this.isMuted ? 0 : video.volume;
      };
      this.isMuted = video.muted;
      this.level = this.isMuted ? 0 : video.volume;
    });
  }

  togglePlayPause(): void {
    const video = global.getVideo();
    video.paused ? video.play() : video.pause();
  }

  addTime(seconds: number): void {
    global.getVideo().currentTime += seconds;
  }
  setCurrentTime(seconds: number): void {
    global.getVideo().currentTime = seconds;
  }

  isMuted: boolean = global.getVideo().muted;
  videoMuted(): boolean {
    return global.getVideo().muted;
  }
  setMuted(isMuted: boolean) {
    this.isMuted = isMuted;
    this.level = this.isMuted ? 0 : global.getVideo().volume;
    global.getVideo().muted = isMuted;
  }

  level: number = global.getVideo().volume;
  /**
   * @returns {number} A decimal value between [0-1]
   */
  videoVolumeLevel(): number {
    return global.getVideo().volume;
  }
  /**
   * @param volume A decimal value between [0-1]
   */
  setVolume(newVolume: number): void {
    global.getVideo().volume = newVolume;
  }
  toggleMuted() {
    this.setMuted(!this.isMuted);
  }
}
