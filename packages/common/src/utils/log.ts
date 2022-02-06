/// <reference path="../../../../@types/types.d.ts" />

/**
 * Custom logger so that extension logs are easier to identify and differentiate from regular
 * webpage logs
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

type LogFn = typeof console.log;

export const SHOULD_LOG =
  __BUILD_STAGE__ === 'dev' || __BUILD_STAGE__ === 'local' || __BUILD_STAGE__ === 'staged';
const LABEL = '⌜Anime Skip⌟';
const GREY_LABEL_STYLE =
  'color: black; background-color: #d8d8d8; padding: 2px 4px; border-radius: 2px; font-weight: bold';
const BLUE_LABEL_STYLE =
  'color: black; background-color: #4ec4f6; padding: 2px 4px; border-radius: 2px; font-weight: bold';
const PURPLE_LABEL_STYLE =
  'color: black; background-color: #bda2e7; padding: 2px 4px; border-radius: 2px; font-weight: bold';
const YELLOW_LABEL_STYLE =
  'color: black; background-color: #fde065; padding: 2px 4px; border-radius: 2px; font-weight: bold';
const RED_LABEL_STYLE =
  'color: black; background-color: #fd6579; padding: 2px 4px; border-radius: 2px; font-weight: bold';

function print(logFn: LogFn, style: string, ...args: any[]) {
  if (typeof args[0] === 'string') {
    const newArgs = [...args];
    logFn(`%c${LABEL}%c ${newArgs.shift()}`, style, '', ...newArgs);
  } else {
    logFn(`%c${LABEL}`, style, ...args);
  }
}

export function debug(...args: any[]) {
  if (SHOULD_LOG) print(console.debug, GREY_LABEL_STYLE, ...args);
}

export function log(...args: any[]) {
  if (SHOULD_LOG) print(console.log, BLUE_LABEL_STYLE, ...args);
}

export function warn(...args: any[]) {
  if (SHOULD_LOG) print(console.warn, YELLOW_LABEL_STYLE, ...args);
}

export function error(...args: any[]) {
  if (SHOULD_LOG) print(console.error, RED_LABEL_STYLE, ...args);
}

export function loadedLog(file: string): void {
  if (SHOULD_LOG) print(console.log, PURPLE_LABEL_STYLE, `Loaded ${file}`);
}

export function groupCollapsed(
  label: string,
  callback: (fns: { log: LogFn; warn: LogFn; error: LogFn; debug: LogFn }) => void
) {
  if (SHOULD_LOG) {
    print(console.groupCollapsed, BLUE_LABEL_STYLE, label);
    callback({
      debug: console.debug,
      error: console.error,
      log: console.log,
      warn: console.warn,
    });
    console.groupEnd();
  }
}
