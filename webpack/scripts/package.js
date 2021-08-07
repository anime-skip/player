/* eslint-disable @typescript-eslint/no-var-requires */
const { script, title, run, CODE, DIM, RESET, BOLD, step, bash } = require('./utils');
const path = require('path');
const fs = require('fs-extra');

function readEnv() {
  let doFirefox = process.argv.includes('--firefox');
  let doChrome = process.argv.includes('--chrome');
  let doChecks = process.argv.includes('--checks');
  if (!doFirefox && !doChrome && !doChecks) {
    doFirefox = true;
    doChrome = true;
    doChecks = true;
  }

  const env = {
    MODE: process.env.BETA === 'true' ? 'beta' : 'prod',

    // Firefox Signing
    FIREFOX_SIGNING_ISSUER: process.env.FIREFOX_SIGNING_ISSUER,
    FIREFOX_SIGNING_SECRET: process.env.FIREFOX_SIGNING_SECRET,
    FIREFOX_SIGNING_ID: process.env.FIREFOX_SIGNING_ID,

    // Chrome Signing
    CHROME_CLIENT_ID: process.env.CHROME_CLIENT_ID,
    CHROME_CLIENT_SECRET: process.env.CHROME_CLIENT_SECRET,
    CHROME_REFRESH_TOKEN: process.env.CHROME_REFRESH_TOKEN,
    CHROME_APP_ID: process.env.CHROME_APP_ID,
  };

  const package = require('../package.json');
  const buildName = `${package.name}-${package.version}-${env.MODE}`;
  const artifactsDir = ['artifacts'];
  const buildVars = {
    PACKAGE_VERSION: package.version,
    PACKAGE_NAME: package.name,

    BUILD_NAME: buildName,
    OUTPUT_DIR: path.join(process.cwd(), ...artifactsDir),
    OUTPUT_DIR_DISPLAY: path.join('.', ...artifactsDir),

    DO_FIREFOX: doFirefox,
    DO_CHROME: doChrome,
    DO_CHECKS: doChecks,
  };

  return { env, buildVars };
}

script(async () => {
  console.log(`\n${BOLD}Packaging Web Extension${RESET}`);
  if (process.env.DRY_RUN === 'true') {
    step('●', 'Performing a dry run');
    console.log();
  }

  title('Build Info');
  const { env, buildVars } = readEnv();

  console.log(`  ${DIM}PACKAGE_VERSION: ${RESET}${BOLD}${buildVars.PACKAGE_VERSION}${RESET}`);
  console.log(`  ${DIM}PACKAGE_NAME:    ${RESET}${BOLD}${buildVars.PACKAGE_NAME}${RESET}`);
  console.log(`  ${DIM}BUILD_NAME:      ${RESET}${BOLD}${buildVars.BUILD_NAME}${RESET}`);
  console.log(`  ${DIM}OUTPUT_DIR:      ${RESET}${BOLD}${buildVars.OUTPUT_DIR_DISPLAY}${RESET}`);

  title('Prepare Outputs');
  await run(`Ensuring ${CODE}${buildVars.OUTPUT_DIR_DISPLAY}/${RESET} exists`, () =>
    fs.ensureDirSync(buildVars.OUTPUT_DIR)
  );
  await run(`Removing ${CODE}dist/`, () => {
    const dist = path.join(__dirname, '..', 'dist');
    fs.emptyDirSync(dist);
    fs.rmdirSync(dist);
  });
  await run(`Removing ${CODE}${buildVars.OUTPUT_DIR_DISPLAY}/*`, () =>
    fs.emptyDirSync(buildVars.OUTPUT_DIR)
  );

  if (buildVars.DO_CHECKS) {
    title('Run Checks');
    // prettier-ignore
    await (async () => {
      await run('Install dependencies',    () => bash('yarn install'));
      await run('Compile TypeScript',      () => bash('yarn compile'));
      await run('Ensure formatting',       () => bash('yarn prettier'));
      await run('Lint source code',        () => bash('yarn lint'));
      await run('Run tests',               () => bash('yarn test'));
      await run('Run E2E tests',           () => bash('yarn test:e2e'));
      await run('Scan extension manifest', () => bash('yarn check-manifest'));
    })()
  }

  await require('./zip-sources')(buildVars.OUTPUT_DIR);
  if (buildVars.DO_FIREFOX) await require('./build-firefox')(buildVars.OUTPUT_DIR, env.MODE);
  if (buildVars.DO_CHROME) await require('./build-chrome')(buildVars.OUTPUT_DIR, env.MODE);

  await require('./deploy')(buildVars, env);
});
