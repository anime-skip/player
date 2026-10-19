import {
  type PlayerOptions,
  PlayerVisibility,
  type ServiceSegment,
} from '@anime-skip/player';
import { defineExtensionMessaging } from '@webext-core/messaging';

export const messaging = defineExtensionMessaging<MessagingProtocol>({
  logger,
});

interface MessagingProtocol {
  getTopFrameUrl(): string;
  getEpisodeInfoFromHelper(): EpisodeInfo;
  getServiceSegmentsFromHelper(): ServiceSegment[];
  sendScreenshotToTab(url: string): void;
  setPlayerVisibility(visibility: PlayerVisibility): void;
}

type EpisodeInfo = Awaited<
  ReturnType<NonNullable<PlayerOptions['getEpisodeInfo']>>
>;
