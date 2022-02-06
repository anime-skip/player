type BuildStage = 'prod' | 'beta' | 'staged' | 'dev' | 'local';

type BrowserType =
  | 'chrome'
  | 'firefox'
  | 'safari'
  | 'opera'
  | 'ie'
  | 'edge'
  | 'edgechromium'
  | 'unsupported';

interface TextInputRef {
  focus(selectAll?: boolean): void;
}

interface AutocompleteItem<T = any> {
  key?: string;
  title: string;
  subtitle?: string;
  data?: T;
}

/**
 * Episode info that is displayed in the top left of the player
 */
interface DisplayEpisodeInfo {
  name: string;
  number?: string;
  absoluteNumber?: string;
  season?: string;
  show: string;
}

// Compile time constants

declare var __BUILD_STAGE__: BuildStage;

/**
 * The version of the distributed application (ie: the web-extension version or the embedded-player
 * version)
 */
declare var __APP_VERSION__: BuildStage;
