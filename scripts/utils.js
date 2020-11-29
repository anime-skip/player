/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const path = require('path');

const ESC = '\x1b';
const RESET = `${ESC}[0m`;
const BOLD = `${ESC}[1m`;
const DIM = `${ESC}[2m`;
const UNDERLINE = `${ESC}[3m`;
const RED = `${ESC}[91m`;
const GREEN = `${ESC}[92m`;
const BLUE = `${ESC}[94m`;
const TEAL = `${ESC}[96m`;
const CODE = `${BOLD}${TEAL}`;

/**
 * @param {String} title String to print
 * @returns {void}
 */
function title(title) {
  console.log(`\n${BOLD}${BLUE}${title}${RESET}`);
}

/**
 * @param {String} message String to print
 * @returns {void}
 */
function step(bullet, message) {
  process.stdout.write(`${RESET} ${bullet} ${RESET}${message}${RESET}`);
}

/**
 * @param {String} message String to print
 * @returns {void}
 */
function subStep(message) {
  process.stdout.write(`    ${DIM}│ ${message}\n`);
}

/**
 * @returns {void}
 */
function clearLine() {
  let backspaces = '';
  for (let i = 0; i < 120; i++) {
    backspaces += '\b';
  }
  process.stdout.write(backspaces);
}

/**
 * @param {() => Promise<void>} runner The scripts main function to run
 * @returns {Promise<void>}
 */
async function script(runner) {
  let code = 0;
  try {
    await runner();
  } catch (err) {
    console.log();
    console.error(`${BOLD}${RED}Packaging failed...${RESET}`);
    console.error(err);
    code = 1;
  }
  console.log();
  process.exit(code);
}

/**
 * @param {string} message The string to print as a step
 * @param {() => Promise<void> | undefined} runner The scripts main function to run
 * @returns {Promise<void>}
 */
async function run(message, runner) {
  try {
    if (runner) {
      step(`${BLUE}●`, message);
      await runner();
      clearLine();
      step(`${GREEN}●`, message + '\n');
    } else {
      step(`${BLUE}●`, message + ' - no runner\n');
    }
  } catch (err) {
    clearLine();
    step(`${RED}●`, message + '\n');
    throw err;
  }
}

/**
 * @param {() => Promise<void>} runner The function to run when NOT doing a dry run
 * @returns {Promise<void>}
 */
async function skipForDryRuns(runner) {
  if (process.env.DRY_RUN === 'true') return;
  await runner();
}

/**
 * @param {string} command The bash command to run
 * @param {any}    env The custom environment variables it has access to
 * @returns {Promise<void>}
 */
async function bash(command, env) {
  try {
    execSync(`${command} 2>&1`, {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, ...env },
    });
  } catch (err) {
    const status = err.status;
    const output = err.output
      .map(line => {
        if (!line) {
          return '';
        }
        return line.toString();
      })
      .join('\n');
    throw Error(`Command failed with status ${status}\n${output}`);
  }
}

module.exports = {
  CODE,
  RESET,
  BOLD,
  DIM,
  UNDERLINE,
  GREEN,
  BLUE,
  TEAL,
  RED,
  run,
  script,
  step,
  subStep,
  title,
  bash,
  skipForDryRuns,
};
