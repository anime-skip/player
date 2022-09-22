import fs from 'fs-extra';
import path from 'path';
import { zip } from 'zip-a-folder';
import { bash, BOLD, CODE, rootPath, run, subStep, title } from '../utils';

/**
 * Files and folders relative to monorepo root to copy
 */
const SOURCES = [
  '.npmrc',
  '.nvmrc',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  'packages/common',
  'packages/player-ui',
  'packages/web-ext-bridge',
  'packages/web-extension/scripts',
  'packages/web-extension/src',
  'packages/web-extension/package.json',
  'packages/web-extension/postcss.config.cjs',
  'packages/web-extension/tailwind.config.cjs',
  'packages/web-extension/tsconfig.json',
  'packages/web-extension/vite.config.ts',
  { in: 'packages/web-extension/SOURCE_CODE_REVIEW.md', out: 'SOURCE_CODE_REVIEW.md' },
];

export async function zipSources(OUTPUT_DIR: string) {
  title(`Creating ${CODE}sources.zip`);
  const tempFolder = path.join(OUTPUT_DIR, '.temp-sources');
  const sourcesZip = path.join(OUTPUT_DIR, 'sources.zip');

  await run(`Moving essential sources to temp folder`, async () => {
    fs.ensureDirSync(tempFolder);
    for (const source of SOURCES) {
      const input = rootPath('../..', typeof source === 'string' ? source : source.in);
      let output = path.join(tempFolder, typeof source === 'string' ? source : source.out);
      const isDir = fs.lstatSync(input).isDirectory();
      const isFile = fs.lstatSync(input).isFile();

      // Don't output /path/to/folder/folder, just output path/to/folder
      if (isDir) output = path.dirname(output);

      if (isDir) {
        fs.ensureDirSync(output);
      }
      if (isDir || isFile) {
        await bash(`cp ${isDir ? '-r' : ''} "${input}" "${output}"`);
      }
    }
  });
  subStep(`${BOLD}${SOURCES.join(' ')}`);

  await run(`Zipping ${CODE}sources.zip`, () => zip(tempFolder, sourcesZip));

  await run('Remove temp folder', () => {
    fs.emptyDirSync(tempFolder);
    fs.rmdirSync(tempFolder);
  });
}
