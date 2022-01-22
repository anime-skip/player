declare module 'web-ext' {
  /**
   * https://github.com/mozilla/web-ext/blob/master/src/cmd/run.js
   */
  export interface CliRunOptions {
    artifactsDir?: string;
    browserConsole: boolean;
    firefox: string;
    firefoxProfile?: string;
    profileCreateIfMissing?: boolean;
    ignoreFiles?: Array<string>;
    keepProfileChanges: boolean;
    noInput?: boolean;
    noReload: boolean;
    preInstall: boolean;
    sourceDir: string;
    watchFile?: Array<string>;
    watchIgnored?: Array<string>;
    startUrl?: Array<string>;
    target?: Array<string>;
    args?: Array<string>;

    // Android CLI options.
    adbBin?: string;
    adbHost?: string;
    adbPort?: string;
    adbDevice?: string;
    adbDiscoveryTimeout?: number;
    adbRemoveOldArtifacts?: boolean;
    firefoxApk?: string;
    firefoxApkComponent?: string;

    // Chromium Desktop CLI options.
    chromiumBinary?: string;
    chromiumProfile?: string;
  }
  export interface NodeRunOptions {
    getValidatedManifest?(): any;
    shouldExitProgram: boolean;
  }
  export interface Runner {
    reloadAllExtensions();
    exit();
  }
  const webExt: {
    cmd: {
      run(cliOptions: CliRunOptions, nodeOptions: NodeRunOptions): Promise<Runner>;
    };
  };
  export default webExt;
}
