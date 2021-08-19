import webExt, { CliRunOptions, Runner } from 'web-ext';
import { rootPath } from '../scripts/utils';
import { ParallelizeController } from './plugin-parallelize';

export function createWebExtController(
  config?: Partial<Omit<CliRunOptions, 'sourceDir' | 'watchFiles' | 'noInput'>>
) {
  let webExtRunner: Runner;
  return new ParallelizeController({
    async afterFirstBuild() {
      const resolvedConfig = {
        browserConsole: false,
        firefox: 'firefox',
        keepProfileChanges: false,
        noReload: false,
        preInstall: false,
        ...config,
        sourceDir: rootPath('extension'),
        watchFiles: [rootPath('extension/manifest.json')],
        noInput: true,
      };
      console.log('web-ext config:', resolvedConfig);
      webExtRunner = await webExt.cmd.run(resolvedConfig, { shouldExitProgram: true });
    },
    async afterEachWatchUpdate() {
      await webExtRunner.reloadAllExtensions();
    },
  });
}
