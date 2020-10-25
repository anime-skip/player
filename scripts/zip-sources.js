/* eslint-disable @typescript-eslint/no-var-requires */
const { title, bash } = require('./utils');
const { subStep, run, CODE, BOLD } = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const { zip } = require('zip-a-folder');

module.exports = async function zipSources(OUTPUT_DIR) {
  title(`Creating ${CODE}sources.zip`);
  const tempFolder = path.join(OUTPUT_DIR, '.temp-sources');
  const sourcesZip = path.join(OUTPUT_DIR, 'sources.zip');
  const sources = [
    'src/',
    'package.json',
    'yarn.lock',
    'SOURCE_CODE_REVIEW.md',
    'webpack.config.js',
    '.babelrc',
    'tsconfig.json',
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

  await run(`Zipping ${CODE}sources.zip`, () => zip(tempFolder, sourcesZip));

  await run('Remove temp folder', () => {
    fs.emptyDirSync(tempFolder);
    fs.rmdirSync(tempFolder);
  });
};
