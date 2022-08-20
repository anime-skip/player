import joi from 'joi';
import { CustomAnimeSkipClient } from '../utils/CustomApiClient';
import { InferredEpisodeInfo, PlayerOptionGroup } from './models';
import { WithRequired } from './modifiers';
import { PlayerStorage } from './player-storage';
import { ScreenshotController } from './screenshot-controller';
import { UsageStatsClient } from '@anime-skip/usage-stats-client';
import { Ref } from 'vue';

export interface ExternalPlayerConfig {
  service: string;
  serviceDisplayName: string;

  /**
   * Configure a timeout in ms for when the player should be shown as "playing" after the video
   * actually starts playing.
   *
   * With this extra timeout, the buffering spinner will not flash in and out multiple times, instead
   * being nice and smooth showing while not playing, and hiding once actual playback has started
   *
   * Some player's don't actually start playing right after the "playing" event fires. instead, they
   * hang for a little bit, fire the "playing" event again, and then start playing. This value should
   * be set to a safe number of milliseconds above how long it usually takes between the two "playing"
   * events.
   *
   * @default 0
   */
  onPlayDebounceMs?: number;

  /**
   * Returns the root element's query. The player is injected into the root element as a child, so
   * this method dictates where the player will be injected at.
   *
   * The extension will also wait for this element to exist before injecting the player, so if the
   * player disappears after showing initially, try a different root, either higher or lower in the
   * tree.
   *
   * TODO: Move this out of player config and into when we load the UI
   */
  getRootQuery(): string;

  /**
   * Query used to get the video element the player wraps around
   */
  getVideoQuery(): string;

  /**
   * Returns the video element whenever the player needs to get it. This should just be a
   * `document.querySelector` or `document.findElementById` for performance reasons
   *
   * TODO: Remove and just use `getVideoQuery`?s
   */
  getVideo?(): HTMLVideoElement;

  /**
   * EXTENSION ONLY
   *
   * Sometimes, the player should not be injected when the url is matched. For example, if you
   * include other video elements that reuse the same query selector used in `getRootQuery`.
   *
   * TODO: pull out of player config and into specific services
   *
   * Example: funimation plays previews at the top of the shows page
   */
  doNotReplacePlayer?(): boolean;

  /**
   * Get the current webpage's suggested episode info. If HTML5 history mode is enabled, and you go
   * to the next episode, this should return the next episode details automatically.
   */
  inferEpisodeInfo(): Promise<InferredEpisodeInfo>;

  /**
   * Convert a raw URL string to one that can be used with Anime Skip. If not passed, query
   * parameters will be removed from your page's URL
   *
   * @param inputUrl The current page's `window.location.href`
   */
  transformServiceUrl?(inputUrl: string): string;

  /**
   * Get the options the the player provides (quality, subtitles, etc), including a function to call
   * when clicked! You're responsible for loading the correct subtitles/video quality, the player
   * only provides the UI for you.
   *
   * Set to `undefined` or return `undefined` if player options are not available for the service.
   */
  getPlaybackOptions?(): Promise<PlayerOptionGroup[] | undefined> | PlayerOptionGroup[] | undefined;

  /**
   * Add a callback that gets called when a video changes (duration is different than before)   */
  onVideoChanged(callback: (video: HTMLVideoElement) => void): void;

  addKeyDownListener?(callback: (event: KeyboardEvent) => void): void;
  removeKeyDownListener?(callback: (event: KeyboardEvent) => void): void;

  /**
   * Storage interface use to persist data to the browser's storage between player visits. Things
   * like your preferences and player settings are stored in this storage.
   */
  storage: PlayerStorage;

  /**
   * Method that opens the "all settings" page
   */
  openAllSettings(): void;

  /**
   * A component that does not render anything, but listens for the screenshot event and actually
   * captures the screen.
   */
  screenshotController: ScreenshotController;
  useApiClient: () => CustomAnimeSkipClient;
  isUrlSupported(url: string): boolean;
  usageClient: UsageStatsClient & { getUserId(): string | Promise<string | undefined> | undefined };
}

export const PlayerConfig = joi.object<ExternalPlayerConfig, true>({
  service: joi.string().required(),
  serviceDisplayName: joi.string().required(),
  onPlayDebounceMs: joi.number().optional(),
  getRootQuery: joi.func().required(),
  getVideoQuery: joi.func().required(),
  getVideo: joi.func().optional(),
  doNotReplacePlayer: joi.func().optional(),
  inferEpisodeInfo: joi.func().required(),
  transformServiceUrl: joi.func().optional(),
  getPlaybackOptions: joi.func().optional(),
  onVideoChanged: joi.func().required(),
  addKeyDownListener: joi.func().required(),
  removeKeyDownListener: joi.func().required(),
  storage: joi.object().required(),
  openAllSettings: joi.func().required(),
  screenshotController: joi.object().required(),
  useApiClient: joi.func().required(),
  isUrlSupported: joi.func().required(),
  usageClient: joi.object().required(),
});

/**
 * Same as `IPlayerConfig`, but with defaults applied
 */
export type InternalPlayerConfig = WithRequired<
  ExternalPlayerConfig,
  'transformServiceUrl' | 'onPlayDebounceMs'
>;
