/* eslint-disable @typescript-eslint/no-var-requires */
const { run, bash, title, CODE, RESET } = require('./utils');
const { zip } = require('zip-a-folder');
const path = require('path');

module.exports = async function buildFirefox(OUTPUT_DIR, BETA) {
  title('Firefox');
  const firefoxZip = path.join(OUTPUT_DIR, 'firefox.zip');
  const firefoxDistTemp = path.join(OUTPUT_DIR, '.firefox-dist');

  await run(`Building ${CODE}dist/${RESET} for Firefox`, () => bash('yarn build:prod', { BETA }));

  await run(`Caching ${CODE}dist/${RESET} for signing`, () => bash(`mv dist "${firefoxDistTemp}"`));

  await run(`Creating ${CODE}firefox.zip`, () => zip(firefoxDistTemp, firefoxZip));
};
