import { PlayerOptions, ScreenshotBounds } from '@anime-skip/player';
import { defineExtensionMessaging } from '@webext-core/messaging';
import { Tabs } from 'webextension-polyfill';

export const messaging = defineExtensionMessaging<MessagingProtocol>({
  logger,
});

interface MessagingProtocol {
  getSenderTab(): Tabs.Tab;
  getEpisodeInfoFromHelper(): EpisodeInfo;
  takeScreenshot(bounds: ScreenshotBounds): string;
}

type EpisodeInfo = Awaited<
  ReturnType<NonNullable<PlayerOptions['getEpisodeInfo']>>
>;
