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
  const dist = rootPath('extension');
  const firefoxZip = path.join(config.OUTPUT_DIR, `firefox-${config.PACKAGE_MODE}.zip`);
  const firefoxDistTemp = path.join(config.OUTPUT_DIR, '.firefox-dist');

  await run(`Building ${CODE}extension/${RESET} for Firefox`, () =>
    bash(`pnpm build --mode ${config.PACKAGE_MODE}`)
  );

  await run(`Checking Firefox ${CODE}manifest.json${RESET}`, () => bash(`pnpm lint:web-ext`));

  await run(`Caching ${CODE}extension/${RESET} for signing`, () =>
    bash(`cp -r ${dist} "${firefoxDistTemp}"`)
  );

  await run(`Creating ${CODE}${firefoxZip}`, () => zip(firefoxDistTemp, firefoxZip));
}
