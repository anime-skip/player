export default class VideoUtils {
  public static nextTimestamp(): void {}
  public static previousTimestamp(): void {}

  public static togglePlayPause(): void {
    const video = global.getVideo();
    video.paused ? video.play() : video.pause();
  }

  public static addTime(seconds: number): void {
    global.getVideo().currentTime += seconds;
  }
  public static setCurrentTime(seconds: number): void {
    global.getVideo().currentTime = seconds;
  }

  public static setMuted(isMuted: boolean): void {
    global.getVideo().muted = isMuted;
  }
  public static setVolume(newVolume: number): void {
    global.getVideo().volume = newVolume;
  }
}
