import fs from 'fs-extra';
import path from 'path';
import { bash, BOLD, CODE, DIM, RESET, run, script, step, title } from '../utils';
import { buildChrome } from './buildChrome';
import { buildFirefox } from './buildFirefox';
import { getConfig } from './config';
import { deploy } from './deploy';
import { zipSources } from './zipSources';

script(async () => {
  console.log(`\n${BOLD}Packaging Web Extension${RESET}`);
  if (process.env.DRY_RUN === 'true') {
    step('●', 'Performing a dry run');
    console.log();
  }

  title('Build Info');
  const config = getConfig();

  console.log(`  ${DIM}PACKAGE_VERSION: ${RESET}${BOLD}${config.PACKAGE_VERSION}${RESET}`);
  console.log(`  ${DIM}PACKAGE_NAME:    ${RESET}${BOLD}${config.PACKAGE_NAME}${RESET}`);
  console.log(`  ${DIM}PACKAGE_MODE:    ${RESET}${BOLD}${config.PACKAGE_MODE}${RESET}`);
  console.log(`  ${DIM}BUILD_NAME:      ${RESET}${BOLD}${config.BUILD_NAME}${RESET}`);
  console.log(`  ${DIM}OUTPUT_DIR:      ${RESET}${BOLD}${config.OUTPUT_DIR_DISPLAY}${RESET}`);
  console.log(`  ${DIM}SKIP_CHECKS:     ${RESET}${BOLD}${config.SKIP_CHECKS}${RESET}`);
  console.log(`  ${DIM}SKIP_FIREFOX:    ${RESET}${BOLD}${config.SKIP_FIREFOX}${RESET}`);
  console.log(`  ${DIM}SKIP_CHROME:     ${RESET}${BOLD}${config.SKIP_CHROME}${RESET}`);

  title('Prepare Outputs');
  await run(`Ensuring ${CODE}${config.OUTPUT_DIR_DISPLAY}/${RESET} exists`, () =>
    fs.ensureDirSync(config.OUTPUT_DIR)
  );
  await run(`Removing ${CODE}dist/`, () => {
    const dist = path.join(__dirname, '..', 'dist');
    fs.emptyDirSync(dist);
    fs.rmdirSync(dist);
  });
  await run(`Removing ${CODE}${config.OUTPUT_DIR_DISPLAY}/*`, () =>
    fs.emptyDirSync(config.OUTPUT_DIR)
  );

  if (!config.SKIP_CHECKS) {
    title('Run Checks');
    // prettier-ignore
    await (async () => {
      await run('Install dependencies',  () => bash('pnpm install'));
      await run('Compile TypeScript',    () => bash('pnpm compile'));
      await run('Ensure formatting',     () => bash('pnpm format:check'));
      await run('Lint source code',      () => bash('pnpm lint:check'));
      await run('Run tests',             () => bash('pnpm test'));
      await run('Run E2E tests',         () => bash('pnpm test:e2e'));
    })()
  }

  if (!config.SKIP_SOURCES) await zipSources(config.OUTPUT_DIR);
  if (!config.SKIP_FIREFOX) await buildFirefox(config);
  if (!config.SKIP_CHROME) await buildChrome(config);

  await deploy(config);
});
