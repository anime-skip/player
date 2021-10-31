// Runtime variables
interface ImportMeta {
  env: {
    VITE_EXT_MODE: ExtensionMode;
  };
}

// Build time variables
namespace NodeJS {
  interface ProcessEnv extends [ImportMeta['env']] {
    BUILD_FOR?: 'firefox' | 'chrome';
    BUILD_MODE?: ExtensionMode;
    BUILD_FIREFOX_PROFILE?: string;
    BUILD_CHROME_PROFILE?: string;

    // Runtime variables
    VITE_EXT_MODE: ExtensionMode;
  }
}
