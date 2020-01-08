export default class Utils {
  public static nextTimestamp(
    currentTime: number,
    timestamps: Api.Timestamp[],
    preferences?: Api.Preferences
  ): Api.Timestamp | undefined {
    if (!preferences) {
      return timestamps.find(timestamp => timestamp.at > currentTime);
    }
    return timestamps.find(
      timestamp =>
        timestamp.at > currentTime && !Utils.isSkipped(timestamp, preferences)
    );
  }

  public static isSkipped(
    { typeId: _typeId }: Api.Timestamp,
    preferences?: Api.Preferences
  ): boolean {
    if (!preferences) return false;
    if (!preferences.enableAutoSkip) return false;
    switch (_typeId) {
      case 0:
        return preferences.skipCanon;
      case 2:
        return preferences.skipBranding;
      case 3:
        return preferences.skipIntros;
      case 4:
        return preferences.skipNewIntros;
      case 5:
        return preferences.skipRecaps;
      case 6:
        return preferences.skipFiller;
      case 7:
        return preferences.skipTransitions;
      case 8:
        return preferences.skipCredits;
      case 9:
        return preferences.skipMixedCredits;
      case 10:
        return preferences.skipPreview;
      case 11:
        return preferences.skipTitleCard;
      default:
        return false;
    }
  }

  public static enterFullscreen(): void {
    const elem = document.querySelector(getRootQuery());
    if (!elem) {
      console.warn('Could not find player to enter fullscreen');
      return;
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      // @ts-ignore
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      // @ts-ignore
      elem.mozRequestFullScreen();
      // @ts-ignore
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      // @ts-ignore
      elem.webkitRequestFullscreen();
      // @ts-ignore
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      // @ts-ignore
      elem.msRequestFullscreen();
    }
  }

  public static isFullscreen(): boolean {
    return document.fullscreenElement != null;
  }

  public static exitFullscreen(): void {
    if (!this.isFullscreen()) {
      console.warn('Not in full screen mode, tried to exit');
      return;
    }
    const d = document as any;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (d.mozCancelFullScreen) {
      /* Firefox */
      d.mozCancelFullScreen();
    } else if (d.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      d.webkitExitFullscreen();
    } else if (d.msExitFullscreen) {
      /* IE/Edge */
      d.msExitFullscreen();
    }
  }

  private static _videoLoadPromise?: Promise<number>;

  /**
   * Returns a promise containing the video's duration
   */
  public static async waitForVideoLoad(): Promise<number> {
    if (!this._videoLoadPromise) {
      this._videoLoadPromise = new Promise(res => {
        const timeout = window.setInterval(function() {
          const video = getVideo();
          const duration = Math.round(video.duration);
          if (video.readyState > 0) {
            res(duration);
            clearInterval(timeout);
          }
        }, 500);
      });
    }
    return this._videoLoadPromise;
  }

  public static formatGraphql(data: string): string {
    const lines = data
      .split('\n')
      .map(line => line.trim())
      .filter(line => !!line);

    function addTabs(string: string, tabs: number): string {
      let result = string;
      for (let i = 0; i < tabs; i++) {
        result = '  ' + result;
      }
      return result;
    }

    let tabs = 0;
    const tabbedLines = lines.map(line => {
      if (line === '}') tabs--;
      const newLine = addTabs(line, tabs);
      if (line.endsWith('{')) tabs++;
      return newLine;
    });

    return tabbedLines.join('\n');
  }
}
