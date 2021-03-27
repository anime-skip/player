/* eslint-disable @typescript-eslint/no-var-requires */
const { title, bash } = require('./utils');
const { subStep, run, CODE, BOLD } = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const { zip } = require('zip-a-folder');
const packageJson = require('../package.json');
const { execSync } = require('child_process');
const { downloadTarball } = require('./download-file');

function isPrivateDependency(dependency) {
  return dependency.startsWith('@anime-skip/');
}
function dependencyFilename(dependency) {
  return dependency.replace(/@/g, '').replace(/\//, '-') + '.tgz';
}

module.exports = async function zipSources(OUTPUT_DIR) {
  title(`Creating ${CODE}sources.zip`);
  const tempFolder = path.join(OUTPUT_DIR, '.temp-sources');
  const sourcesZip = path.join(OUTPUT_DIR, 'sources.zip');
  const sources = [
    'src/',
    'package.json',
    'yarn.lock',
    'SOURCE_CODE_REVIEW.md',
    'webpack.js',
    '.babelrc',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js',
  ];

  await run(`Moving essential sources to temp folder`, async () => {
    fs.ensureDirSync(tempFolder);
    for (const source of sources) {
      const flags = [];
      if (source.endsWith('/')) flags.push('-r');

      await bash(`cp ${flags.join(' ')} "${source}" "${tempFolder}"`);
    }
  });
  subStep(`${BOLD}${sources.join(' ')}`);

  const privateDeps = Object.keys(packageJson.dependencies).filter(isPrivateDependency);
  if (privateDeps.length > 0) {
    await run(`Download private modules tp ${CODE}local_modules/`, async () => {
      const localModulesDir = path.resolve(tempFolder, 'local_modules');
      fs.mkdirSync(localModulesDir);
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

    await run(`Pointing to local_modules in ${CODE}package.json`, () => {
      const packageJsonCopy = JSON.parse(JSON.stringify(packageJson));
      const depReplacer = dep => {
        if (packageJsonCopy.dependencies[dep] != null) {
          packageJsonCopy.dependencies[dep] = `./local_modules/${dependencyFilename(dep)}`;
        }
        if (packageJsonCopy.devDependencies[dep] != null) {
          packageJsonCopy.dependencies[dep] = `./local_modules/${dependencyFilename(dep)}`;
        }
      };
      privateDeps.forEach(depReplacer);
      fs.writeFileSync(
        path.join(tempFolder, 'package.json'),
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
};
