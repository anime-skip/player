namespace NodeJS {
  interface ProcessEnv extends [ImportMeta['env']] {
    BUILD_FOR?: 'firefox' | 'chrome';
    BUILD_MODE?: ExtensionMode;
  }
}
