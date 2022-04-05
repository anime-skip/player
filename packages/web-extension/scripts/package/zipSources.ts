import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { zip } from 'zip-a-folder';
import packageJson from '../../package.json';
import { bash, BOLD, CODE, rootPath, run, subStep, title } from '../utils';
import { downloadTarball } from './downloadTarball';

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
  'packages/web-extension/scripts',
  'packages/web-extension/src',
  'packages/web-extension/package.json',
  'packages/web-extension/postcss.config.js',
  'packages/web-extension/tailwind.config.js',
  'packages/web-extension/tsconfig.json',
  'packages/web-extension/vite.config.ts',
  { in: 'packages/web-extension/SOURCE_CODE_REVIEW.md', out: 'SOURCE_CODE_REVIEW.md' },
];

function isPrivateDependency(dependency: string) {
  return dependency.startsWith('@anime-skip/');
}
function dependencyFilename(dependency: string) {
  return dependency.replace(/@/g, '').replace(/\//, '-') + '.tgz';
}

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

  const privateDeps = Object.keys(packageJson.dependencies).filter(isPrivateDependency);
  if (privateDeps.length > 0) {
    await run(`Download private modules to ${CODE}local_modules/`, async () => {
      const localModulesDir = path.resolve(tempFolder, 'local_modules');
      fs.ensureDirSync(localModulesDir);
      await Promise.all(
        privateDeps.map(async dep => {
          const url = execSync(`npm view ${dep} dist.tarball`, { encoding: 'utf-8' }).trim();
          const filename = dependencyFilename(dep);
          const tarballPath = path.resolve(localModulesDir, filename);
          await downloadTarball(url, tarballPath);
        })
      );
    });
    subStep(`${BOLD}${privateDeps.join(' ')}`);

    await run(`Pointing to local_modules in ${CODE}packages/web-extension/package.json`, () => {
      const packageJsonCopy = JSON.parse(JSON.stringify(packageJson));
      const depReplacer = (dep: string) => {
        if (packageJsonCopy.dependencies[dep] != null) {
          packageJsonCopy.dependencies[dep] = `../../local_modules/${dependencyFilename(dep)}`;
        }
        if (packageJsonCopy.devDependencies[dep] != null) {
          packageJsonCopy.dependencies[dep] = `../../local_modules/${dependencyFilename(dep)}`;
        }
      };
      privateDeps.forEach(depReplacer);
      fs.writeFileSync(
        path.join(tempFolder, 'packages/web-extension/package.json'),
        JSON.stringify(packageJsonCopy, null, 2),
        { encoding: 'utf-8' }
      );
    });
  }

  await run(`Zipping ${CODE}sources.zip`, () => zip(tempFolder, sourcesZip));

  await run('Remove temp folder', () => {
    fs.emptyDirSync(tempFolder);
    fs.rmdirSync(tempFolder);
  });
}
