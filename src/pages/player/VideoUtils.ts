export default class VideoUtils {
  public static nextTimestamp(): void {}
  public static previousTimestamp(): void {}

  public static togglePlayPause(): void {
    const video = getVideo();
    video.paused ? video.play() : video.pause();
  }

  public static addTime(seconds: number): void {
    getVideo().currentTime += seconds;
  }
  public static setCurrentTime(seconds: number): void {
    getVideo().currentTime = seconds;
  }

  public static setMuted(isMuted: boolean): void {
    getVideo().muted = isMuted;
  }
  public static setVolume(newVolume: number): void {
    getVideo().volume = newVolume;
  }
}
