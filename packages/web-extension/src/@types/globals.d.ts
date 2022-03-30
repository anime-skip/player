declare function addKeyDownListener(callback: (event: KeyboardEvent) => void): void;
declare function removeKeyDownListener(callback: (event: KeyboardEvent) => void): void;

// Defined globals
declare const EXTENSION_VERSION: string;
declare const EXTENSION_MODE: ExtensionMode;
declare const TARGET_BROWSER: SupportedBrowser;
