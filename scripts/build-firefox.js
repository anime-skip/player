/* eslint-disable @typescript-eslint/no-var-requires */
const { run, bash, title, CODE, RESET } = require('./utils');
const { zip } = require('zip-a-folder');
const path = require('path');

module.exports = async function buildFirefox(OUTPUT_DIR, mode) {
  title('Firefox');
  const firefoxZip = path.join(OUTPUT_DIR, `firefox-${mode}.zip`);
  const firefoxDistTemp = path.join(OUTPUT_DIR, '.firefox-dist');

  await run(`Building ${CODE}dist/${RESET} for Firefox`, () => bash(`yarn build --mode ${mode}`));

  await run(`Caching ${CODE}dist/${RESET} for signing`, () => bash(`mv dist "${firefoxDistTemp}"`));

  await run(`Creating ${CODE}${firefoxZip}`, () => zip(firefoxDistTemp, firefoxZip));
};
