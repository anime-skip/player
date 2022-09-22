import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function rootPath(...args: string[]): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', ...args);
}

const isCi = process.env.CI === 'true';

export const ESC = '\x1b';
export const RESET = `${ESC}[0m`;
export const BOLD = `${ESC}[1m`;
export const DIM = `${ESC}[2m`;
export const UNDERLINE = `${ESC}[3m`;
export const RED = `${ESC}[91m`;
export const GREEN = `${ESC}[92m`;
export const BLUE = `${ESC}[94m`;
export const TEAL = `${ESC}[96m`;
export const CODE = `${BOLD}${TEAL}`;

/**
 * @param title String to print
 */
export function title(title: string): void {
  console.log(`\n${BOLD}${BLUE}${title}${RESET}`);
}

/**
 * @param bullet The bullet (including color) to use
 * @param message String to print
 */
export function step(bullet: string, message: string): void {
  process.stdout.write(`${RESET} ${bullet} ${RESET}${message}${RESET}`);
}

/**
 * @param message String to print
 */
export function subStep(message: string): void {
  process.stdout.write(`    ${DIM}│ ${message}\n`);
}

export function clearLine(): void {
  let backspaces = '';
  for (let i = 0; i < 120; i++) {
    backspaces += '\b';
  }
  process.stdout.write(backspaces);
}

/**
 * @param runner The scripts main function to run
 */
export async function script(runner: () => Promise<void>): Promise<void> {
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
 * @param message The string to print as a step
 * @param runner The scripts main function to run
 */
export async function run(
  message: string,
  runner: (() => Promise<void>) | (() => void) | undefined
): Promise<void> {
  try {
    if (runner) {
      if (!isCi) step(`${BLUE}●`, message);
      await runner();
      if (!isCi) clearLine();
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
 * @param runner The function to run when NOT doing a dry run
 */
export async function skipForDryRuns(runner: () => Promise<void>): Promise<void> {
  if (isDryRun()) return;
  await runner();
}

export function isDryRun(): boolean {
  return process.env.DRY_RUN === 'true';
}

/**
 * @param command The bash command to run
 * @param env The custom environment variables it has access to
 */
export async function bash(command: string, env?: any): Promise<void> {
  try {
    execSync(`${command} 2>&1`, {
      cwd: rootPath(),
      env: { ...process.env, ...env },
    });
  } catch (err: any) {
    const status = err.status;
    const output = err.output
      .map((line: string) => {
        if (!line) {
          return '';
        }
        return line.toString();
      })
      .join('\n');
    throw Error(`Command failed with status ${status}\n${output}`);
  }
}

export function requireOr<T>(callback: () => T, fallback: T): T {
  try {
    return callback();
  } catch (err) {
    return fallback;
  }
}
