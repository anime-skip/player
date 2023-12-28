import { PlayerOptions } from '@anime-skip/player';
import { defineExtensionMessaging } from '@webext-core/messaging';
import { Tabs } from 'webextension-polyfill';

export const messaging = defineExtensionMessaging<MessagingProtocol>({
  logger,
});

interface MessagingProtocol {
  getSenderTab(): Tabs.Tab;
  getEpisodeInfoFromHelper(): EpisodeInfo;
}

type EpisodeInfo = Awaited<
  ReturnType<NonNullable<PlayerOptions['getEpisodeInfo']>>
>;
