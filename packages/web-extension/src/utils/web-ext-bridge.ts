import { createWebExtBridge, ProtocolWithReturn } from '@anime-skip/web-ext-bridge';
import { CrawledEpisodeInfo, ScreenshotDetails } from '~types';
import * as logger from './log';

interface ProtocolMap {
  '@anime-skip/inferEpisodeInfo': ProtocolWithReturn<undefined, CrawledEpisodeInfo>;
  '@anime-skip/parent-screenshot-details': ProtocolWithReturn<undefined, ScreenshotDetails>;
  '@anime-skip/player-screenshot-details': ProtocolWithReturn<undefined, ScreenshotDetails>;
  '@anime-skip/start-screenshot': undefined;
  '@anime-skip/stop-screenshot': undefined;
  '@anime-skip/open-all-settings': undefined;
  '@anime-skip/open-login': undefined;
  '@anime-skip/get-url': ProtocolWithReturn<undefined, string>;
  '@anime-skip/setup-context-menu': undefined;
  '@anime-skip/remove-context-menu': undefined;
  '@anime-skip/changeUrl': string;
}

export const { sendMessage, onMessage } = createWebExtBridge<ProtocolMap>({ logger });
