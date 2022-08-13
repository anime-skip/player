import { ProtocolWithReturn } from 'webext-bridge';

declare module 'webext-bridge' {
  /**
   * Docs: https://github.com/zikaari/webext-bridge#type-safe-protocols
   */
  export interface ProtocolMap {
    '@anime-skip/inferEpisodeInfo': ProtocolWithReturn<undefined, InferredEpisodeInfo>;
    '@anime-skip/parent-screenshot-details': ProtocolWithReturn<undefined, ScreenshotDetails>;
    '@anime-skip/player-screenshot-details': ProtocolWithReturn<undefined, ScreenshotDetails>;
    '@anime-skip/start-screenshot': undefined;
    '@anime-skip/stop-screenshot': undefined;
    '@anime-skip/open-all-settings': undefined;
    '@anime-skip/open-login': undefined;
    '@anime-skip/get-url': ProtocolWithReturn<undefined, string | undefined>;
    '@anime-skip/setup-context-menu': undefined;
    '@anime-skip/remove-context-menu': undefined;
  }
}
