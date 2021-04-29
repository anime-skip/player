/* eslint-disable @typescript-eslint/no-var-requires */
const { run, bash, title, CODE, RESET } = require('./utils');
const { zip } = require('zip-a-folder');
const path = require('path');

module.exports = async function buildChrome(OUTPUT_DIR, mode) {
  title('Chrome');
  const chromeZip = path.join(OUTPUT_DIR, `chrome-${mode}.zip`);
  const dist = path.join(__dirname, '..', 'dist');

  await run(`Building ${CODE}dist/${RESET} for Chrome`, () =>
    bash(`yarn build --mode ${mode} --for chrome`)
  );

  await run(`Creating ${CODE}${chromeZip}`, () => zip(dist, chromeZip));
};
