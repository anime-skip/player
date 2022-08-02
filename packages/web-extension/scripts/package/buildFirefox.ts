import path from 'path';
import { zip } from 'zip-a-folder';
import { bash, CODE, RESET, rootPath, run, title } from '../utils';
import { PackageConfig } from './config';

/**
 * Builds our firefox.zip asset, and a temp directory to use when uploading the extension. The Addon
 * store does not accept ZIP files for the upload
 */
export async function buildFirefox(config: PackageConfig) {
  title('Firefox');
  const dist = rootPath('dist');
  const firefoxZip = path.join(config.OUTPUT_DIR, `firefox-${config.PACKAGE_MODE}.zip`);

  await run(`Building ${CODE}dist/${RESET} for Firefox`, () =>
    bash(`pnpm vite build`, {
      BUILD_MODE: config.PACKAGE_MODE,
      BUILD_FOR: 'firefox',
    })
  );

  await run(`Checking Firefox ${CODE}manifest.json${RESET}`, () => bash(`pnpm lint:web-ext`));

  await run(`Creating ${CODE}${firefoxZip}`, () => zip(dist, firefoxZip));
}
