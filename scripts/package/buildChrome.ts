import path from 'path';
import { zip } from 'zip-a-folder';
import { bash, CODE, RESET, rootPath, run, title } from '../utils';
import { PackageConfig } from './config';

/**
 * Just build a zip asset to be uploaded to github and the chrome web store
 */
export async function buildChrome(config: PackageConfig) {
  title('Chrome');
  const chromeZip = path.join(config.OUTPUT_DIR, `chrome-${config.PACKAGE_MODE}.zip`);
  const dist = rootPath('extension');

  await run(`Building ${CODE}extension/${RESET} for Chrome`, () =>
    bash(`pnpm build --mode ${config.PACKAGE_MODE} --for chrome`)
  );

  await run(`Checking Chrome ${CODE}manifest.json${RESET}`, () => bash(`pnpm lint:web-ext`));

  await run(`Creating ${CODE}${chromeZip}`, () => zip(dist, chromeZip));
}
