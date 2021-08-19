// Build time variables
namespace NodeJS {
  interface ProcessEnv {
    BUILD_FOR?: 'firefox' | 'chrome';
    BUILD_MODE?: 'prod' | 'beta' | 'staged' | 'dev';
    BUILD_FIREFOX_PROFILE?: string;
    BUILD_CHROME_PROFILE?: string;
  }
}

// Runtime variables
interface ImportMeta {
  env: {
    VITE_EXT_MODE?: ExtensionMode;
  };
}
