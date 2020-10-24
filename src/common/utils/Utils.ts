export default class Utils {
  /**
   * @param currentTime The time to begin looking for timestamps after
   * @param timestamps The list of timestamps, sorted by `timestamp.at`
   * @param preferences The user's preferences to decide what sections are skipped. NOTE - this
   *                    argument is not optional, but `undefined` can be passed. This is done to
   *                    make sure you don't forget to pass this, and to make what is passed here an
   *                    explict decision
   * @returns The next EXCLUSIVE timestamp that comes after the `currentTime` and is not skipped. If
   *          no preferences are passed, no sections are considered skipped so this just returns the
   *          next timestamp. Timestamps at a time equal to the `currentTime` will not be
   *          returned (thus exclusive).
   */
  public static nextTimestamp<T extends Api.AmbigousTimestamp>(
    currentTime: number,
    timestamps: T[],
    preferences: Api.Preferences | undefined
  ): T | undefined {
    if (!preferences) {
      return timestamps.find(timestamp => timestamp.at > currentTime);
    }
    return timestamps.find(
      timestamp => timestamp.at > currentTime && !Utils.isSkipped(timestamp, preferences)
    );
  }

  public static previousTimestamp<T extends Api.AmbigousTimestamp>(
    time: number,
    timestamps: T[],
    preferences: Api.Preferences | undefined
  ): T | undefined {
    if (!preferences) {
      return timestamps.filter(timestamp => timestamp.at < time - 0.1).pop();
    }
    return timestamps
      .filter(timestamp => !Utils.isSkipped(timestamp, preferences) && timestamp.at < time - 0.1)
      .pop();
  }

  public static isSkipped(
    { typeId: _typeId }: Api.AmbigousTimestamp,
    preferences: Api.Preferences | undefined
  ): boolean {
    if (!preferences) return false;
    if (!preferences.enableAutoSkip) return false;
    switch (_typeId) {
      case '9edc0037-fa4e-47a7-a29a-d9c43368daa8':
        return preferences.skipCanon;
      case '97e3629a-95e5-4b1a-9411-73a47c0d0e25':
        return preferences.skipBranding;
      case '14550023-2589-46f0-bfb4-152976506b4c':
        return preferences.skipIntros;
      case 'cbb42238-d285-4c88-9e91-feab4bb8ae0a':
        return preferences.skipMixedIntros;
      case '679fb610-ff3c-4cf4-83c0-75bcc7fe8778':
        return preferences.skipNewIntros;
      case 'f38ac196-0d49-40a9-8fcf-f3ef2f40f127':
        return preferences.skipRecaps;
      case 'c48f1dce-1890-4394-8ce6-c3f5b2f95e5e':
        return preferences.skipFiller;
      case '9f0c6532-ccae-4238-83ec-a2804fe5f7b0':
        return preferences.skipTransitions;
      case '2a730a51-a601-439b-bc1f-7b94a640ffb9':
        return preferences.skipCredits;
      case '6c4ade53-4fee-447f-89e4-3bb29184e87a':
        return preferences.skipMixedCredits;
      case 'd839cdb1-21b3-455d-9c21-7ffeb37adbec':
        return preferences.skipNewCredits;
      case 'c7b1eddb-defa-4bc6-a598-f143081cfe4b':
        return preferences.skipPreview;
      case '67321535-a4ea-4f21-8bed-fb3c8286b510':
        return preferences.skipTitleCard;
      default:
        return false;
    }
  }

  public static enterFullscreen(): void {
    const elem = document.querySelector(global.getRootQuery());
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
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
          const video = global.getVideo();
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

  /**
   * Strip out hashes and query params from a url
   * @param url The input url
   */
  public static stripUrl(url: string): string {
    const urlDetails = new URL(url);
    return `${urlDetails.protocol}//${urlDetails.hostname}${urlDetails.pathname}`;
  }

  public static formatSeconds(seconds: number, includeDecimals: boolean) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const secStr = Utils.padLeft(Math.floor(secs), 2);
    if (includeDecimals) {
      let decimal = Math.round((secs - Math.floor(secs)) * 100);
      if (decimal === 100) decimal = 99;
      return `${mins}:${secStr}.${Utils.padLeft(decimal, 2)}`;
    } else {
      return `${mins}:${secStr}`;
    }
    // return mins + ':' + (secs < 10 ? '0' : '') + secs;
    // return `${mins}:${Utils.padLeft(seconds, 2)}`;
  }

  public static padLeft(value: number | string, size: number, char = '0'): string {
    let num = value.toString();
    while (num.length < size) num = char + num;
    return num;
  }

  public static padRight(value: number | string, size: number, char = '0'): string {
    let num = value.toString();
    while (num.length < size) num += char;
    return num;
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

  public static randomId(): number {
    return Math.random() * Number.MAX_SAFE_INTEGER;
  }

  public static arrayIncludes<T>(array: T[], idKey: keyof T, value: T): boolean {
    return array.some(item => item[idKey] === value[idKey]);
  }

  public static computeTimestampDiffs(
    oldTimestamps: Api.Timestamp[],
    newTimestamps: Api.AmbigousTimestamp[]
  ): { toCreate: Api.InputTimestamp[]; toUpdate: Api.Timestamp[]; toDelete: Api.Timestamp[] } {
    const intersect = newTimestamps.filter(newItem =>
      Utils.arrayIncludes(oldTimestamps, 'id', newItem)
    ) as Api.Timestamp[];

    // Remove unchanged items
    const oldItemMap: { [id: string]: Api.Timestamp } = {};
    oldTimestamps.forEach(item => {
      oldItemMap[item.id] = item;
    });
    const toUpdate = intersect
      .filter(newItem => {
        return (
          newItem.at !== oldItemMap[newItem.id].at ||
          newItem.typeId !== oldItemMap[newItem.id].typeId
        );
      })
      .map<Api.Timestamp>(item => ({
        id: item.id,
        source: item.source ?? 'ANIME_SKIP',
        at: item.at,
        typeId: item.typeId,
      }));

    // prettier-ignore
    return {
      toCreate: newTimestamps.filter(newItem => !Utils.arrayIncludes(oldTimestamps, "id", newItem)) as Api.InputTimestamp[],
      toUpdate,
      toDelete: oldTimestamps.filter(oldItem => !Utils.arrayIncludes(newTimestamps, "id", oldItem))
    };
  }

  public static timestampSorter(l: Api.AmbigousTimestamp, r: Api.AmbigousTimestamp): number {
    return l.at - r.at;
  }

  public static isKeyComboAllowed(event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'Escape':
      case 'Enter':
      case 'Backspace':
      case 'Control':
      case 'Alt':
      case 'Shift':
      case 'Meta':
      case 'PageUp':
      case 'PageDown':
      case 'Home':
      case 'End':
      case 'Insert':
      case 'Delete':
      case 'Tab':
      case 'Pause':
      case 'NumLock':
      case 'CapsLock':
      case 'ScrollLock':
      case 'ContextMenu':
        return false;
    }
    return true;
  }

  public static keyComboFromEvent(event: KeyboardEvent): string {
    let key = event.key;
    if (key === ' ') key = 'Space';
    else if (key === 'ArrowRight') key = '→';
    else if (key === 'ArrowLeft') key = '←';
    else if (key === 'ArrowUp') key = '↑';
    else if (key === 'ArrowDown') key = '↓';
    else key = key.toUpperCase();

    if (event.ctrlKey) key = `ctrl+${key}`;
    if (event.altKey) key = `alt+${key}`;
    if (event.shiftKey) key = `shift+${key}`;
    if (event.metaKey) key = `meta+${key}`;
    return key;
  }

  public static findShortcutAction(
    keyCombo: string,
    keyMapping: KeyboardShortcutsMap
  ): KeyboardShortcutAction | undefined {
    for (const action in keyMapping) {
      if (keyMapping[action as KeyboardShortcutAction] === keyCombo) {
        return action as KeyboardShortcutAction;
      }
    }
    return undefined;
  }
}
