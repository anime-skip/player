import * as Api from '~api';
import { warn } from './log';

// TODO: Refactor all the functions out of "GeneralUtils" and into targeted files

export default class GeneralUtils {
  /**
   * Get the next timestamp after a certain time, ignoring what is skipped by the `preferences`
   */
  public static nextTimestampInVideo<T extends Api.AmbiguousTimestamp>(
    currentTime: number,
    timestamps: T[]
  ): T | undefined {
    return timestamps.find(timestamp => timestamp.at > currentTime);
  }

  /**
   * Get the next timestamp after a certain time, based on what is skipped by the `preferences`
   */
  public static nextTimestamp<T extends Api.AmbiguousTimestamp>(
    currentTime: number,
    timestamps: T[],
    preferences: Api.Preferences
  ): T | undefined {
    return timestamps.find(
      timestamp => timestamp.at > currentTime && !GeneralUtils.isSkipped(timestamp, preferences)
    );
  }

  /**
   * Get the first timestamp before a certain time, ignoring what is skipped by the `preferences`
   */
  public static previousTimestampInVideo<T extends Api.AmbiguousTimestamp>(
    time: number,
    timestamps: T[]
  ): T | undefined {
    return timestamps.filter(timestamp => timestamp.at < time).pop();
  }

  public static isSkipped(
    { typeId: _typeId }: Api.AmbiguousTimestamp,
    preferences: Api.Preferences
  ): boolean {
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
    const elem = document.querySelector(window.getRootQuery());
    if (!elem) {
      warn('Could not find player to enter fullscreen');
      return;
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      // @ts-expect-error: difficult typing
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      // @ts-expect-error: difficult typing
      elem.mozRequestFullScreen();
      // @ts-expect-error: difficult typing
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      // @ts-expect-error: difficult typing
      elem.webkitRequestFullscreen();
      // @ts-expect-error: difficult typing
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      // @ts-expect-error: difficult typing
      elem.msRequestFullscreen();
    }
  }

  public static isFullscreen(): boolean {
    return document.fullscreenElement != null;
  }

  public static exitFullscreen(): void {
    if (!this.isFullscreen()) {
      warn('Not in full screen mode, tried to exit');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        const timeout = window.setInterval(function () {
          const video = window.getVideo?.();
          if (video && video.readyState > 0) {
            res(video.duration);
            clearInterval(timeout);
          }
        }, 250);
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
    const secStr = GeneralUtils.padLeft(Math.floor(secs), 2);
    if (includeDecimals) {
      let decimal = Math.round((secs - Math.floor(secs)) * 100);
      if (decimal === 100) decimal = 99;
      return `${mins}:${secStr}.${GeneralUtils.padLeft(decimal, 2)}`;
    } else {
      return `${mins}:${secStr}`;
    }
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public static arrayIncludes<K extends string>(
    array: { [key in K]: any }[],
    idKey: K,
    value: { [key in K]: any } & Record<string, any>
  ): boolean {
    return array.some(item => item[idKey] === value[idKey]);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  public static computeListDiffs<T>(
    newItems: ReadonlyArray<T>,
    oldItems: ReadonlyArray<T>,
    getId: (item: T) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
    compareNeedsUpdated: (l: T, r: T) => boolean
  ): {
    toCreate: ReadonlyArray<T>;
    toUpdate: ReadonlyArray<T>;
    toDelete: ReadonlyArray<T>;
    toLeave: ReadonlyArray<T>;
  } {
    const getItemMap = (items: ReadonlyArray<T>) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items.reduce<Record<any, T>>((map, item) => {
        map[getId(item)] = item;
        return map;
      }, {});
    const oldItemsMap = getItemMap(oldItems);
    const newItemsMap = getItemMap(newItems);

    const intersection = newItems.filter(newItem => !!oldItemsMap[getId(newItem)]);
    const toUpdate: T[] = [];
    const toLeave: T[] = [];
    intersection.forEach(newItem => {
      const oldItem = oldItemsMap[getId(newItem)];
      if (compareNeedsUpdated(newItem, oldItem)) {
        toUpdate.push(newItem);
      } else {
        toLeave.push(oldItem);
      }
    });

    return {
      toCreate: newItems.filter(newItem => !oldItemsMap[getId(newItem)]),
      toUpdate,
      toDelete: oldItems.filter(oldItem => !newItemsMap[getId(oldItem)]),
      toLeave,
    };
  }

  // TODO: Move to useSyncTimestamps
  public static computeTimestampDiffs(
    oldTimestamps: Api.Timestamp[],
    newTimestamps: Api.AmbiguousTimestamp[]
  ): { toCreate: Api.InputTimestamp[]; toUpdate: Api.Timestamp[]; toDelete: Api.Timestamp[] } {
    const intersect = newTimestamps.filter(newItem =>
      GeneralUtils.arrayIncludes(oldTimestamps, 'id', newItem)
    ) as Api.Timestamp[];

    // Remove unchanged items
    const oldItemMap: { [id: string]: Api.Timestamp } = {};
    oldTimestamps.forEach(item => {
      oldItemMap[item.id] = item;
    });

    const toCreate = newTimestamps.filter(
      newItem => !GeneralUtils.arrayIncludes(oldTimestamps, 'id', newItem)
    ) as Api.InputTimestamp[];
    const toUpdate = intersect
      .filter(newItem => {
        const oldItem = oldItemMap[newItem.id];
        return newItem.at !== oldItem.at || newItem.typeId !== oldItem.typeId;
      })
      .map(item => ({
        id: item.id,
        source: item.source ?? 'ANIME_SKIP',
        at: item.at,
        typeId: item.typeId,
      }));
    const toDelete = oldTimestamps.filter(
      oldItem => !GeneralUtils.arrayIncludes(newTimestamps, 'id', oldItem)
    );
    return {
      toCreate,
      toUpdate,
      toDelete,
    };
  }

  public static timestampSorter(l: Api.AmbiguousTimestamp, r: Api.AmbiguousTimestamp): number {
    return l.at - r.at;
  }

  public static isModiferKeyPressed(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
  }

  public static isKeyComboAllowed(event: KeyboardEvent): boolean {
    const isModifierPressed = this.isModiferKeyPressed(event);
    switch (event.key) {
      case 'Enter':
      case 'Backspace':
      case 'Escape':
        return isModifierPressed;
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

  /**
   * Calculate the offset of the timestamps because of a difference in duration length. The return
   * value should be used with `applyTimestampOffset` and `undoTimestampOffset`, and math should not
   * be done inline
   *
   * @param baseDuration The duration of the video the timestamps were based on
   * @param duration The duration of the current video
   * @returns The number of seconds difference between the two
   */
  public static computeTimestampsOffset(baseDuration: number, duration: number): number {
    return duration - baseDuration;
  }

  public static applyTimestampsOffset(
    timestampsOffset: number | undefined,
    timestampAt: number
  ): number {
    return (timestampsOffset ?? 0) + timestampAt;
  }

  public static undoTimestampOffset(
    timestampsOffset: number | undefined,
    timestampAt: number
  ): number {
    return timestampAt - (timestampsOffset ?? 0);
  }

  public static boundedNumber(
    value: number,
    [lowBound, highBound]: [number | undefined, number | undefined]
  ): number {
    if (lowBound != null && value < lowBound) return lowBound;
    if (highBound != null && value > highBound) return highBound;
    return value;
  }

  public static setIntervalUntil(callback: () => boolean, interval: number, timeout: number): void {
    function clearBothTimers(): void {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      window.clearTimeout(timeoutTimer);
      window.clearInterval(intervalTimer);
      /* eslint-enable @typescript-eslint/no-use-before-define */
    }
    const timeoutTimer = window.setTimeout(clearBothTimers, timeout);
    const intervalTimer = window.setInterval(() => {
      const stopEarly = callback();
      if (stopEarly) {
        clearBothTimers();
      }
    }, interval);
  }
}
