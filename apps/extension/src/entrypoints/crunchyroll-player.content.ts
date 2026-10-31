import '~/assets/crunchyroll-player.scss';
import { ColorTheme, TimestampSource } from '@anime-skip/player';

import { defineSpaContentScript } from '@/utils/define-spa-content-script';

const PLAYER_SELECTOR = '#player-container';
const VIDEO_SELECTOR = 'video';
const TIMELINE_SELECTOR =
  "[data-testid='timeline-controls-container'] input[type=range]";

/**
 * Crunchyroll's Bitmovin player doesn't support setting `video.currentTime`
 * directly - it never loads the new segments and playback stalls until the page
 * page is reloaded. Instead, seek through Crunchyroll's own (hidden) timeline
 * slider, which only commits a seek on mouseup after a mousedown.
 *
 * `video.currentTime` is still set afterwards so the video reports the new time
 * immediately, instead of the old time until Bitmovin's async seek starts.
 */
function seek(video: HTMLVideoElement, time: number): void {
  const timeline = document.querySelector<HTMLInputElement>(TIMELINE_SELECTOR);
  if (timeline == null) {
    logger.warn(
      'Crunchyroll timeline not found, falling back to setting currentTime',
    );
    video.currentTime = time;
    return;
  }

  const mouseInit: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    button: 0,
  };
  timeline.dispatchEvent(new MouseEvent('mousedown', mouseInit));
  // Use the native setter so React's value tracking doesn't swallow the change
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )!.set!.call(timeline, String(time));
  timeline.dispatchEvent(new Event('input', { bubbles: true }));
  timeline.dispatchEvent(new MouseEvent('mouseup', mouseInit));

  video.currentTime = time;
}

export default defineSpaContentScript({
  matches: ['*://www.crunchyroll.com/watch/*'],
  async main(ctx) {
    // Need to wait for both the player wrapper and video element, the video
    // element is rendered last, so we wait for that.
    await waitUntil(
      () => Promise.resolve(!!document.querySelector(VIDEO_SELECTOR)),
      Infinity,
      1,
      100,
    );

    // Load player
    initExtensionPlayer({
      ctx,
      serviceName: 'Crunchyroll',
      serviceTheme: ColorTheme.CrunchyrollOrange,
      serviceTimestampSource: TimestampSource.Crunchyroll,
      parentElement: PLAYER_SELECTOR,
      fullscreenElement: PLAYER_SELECTOR,
      seek,
    });
  },
});
