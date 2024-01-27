import { PlayerOptions, PlayerVisibility } from '@anime-skip/player';
import { defineExtensionMessaging } from '@webext-core/messaging';

export const messaging = defineExtensionMessaging<MessagingProtocol>({
  logger,
});

interface MessagingProtocol {
  getTopFrameUrl(): string;
  getEpisodeInfoFromHelper(): EpisodeInfo;
  sendScreenshotToTab(url: string): void;
  setPlayerVisibility(visibility: PlayerVisibility): void;
}

type EpisodeInfo = Awaited<
  ReturnType<NonNullable<PlayerOptions['getEpisodeInfo']>>
>;
