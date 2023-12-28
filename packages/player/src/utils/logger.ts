export function createLogger(prefix: string, disabled?: boolean) {
  const label = `⌜@anime-skip/${prefix}⌟`;
  function print(logFn: LogFn, style: string, ...args: any[]) {
    if (typeof args[0] === 'string') {
      const newArgs = [...args];
      logFn(`%c${label}%c ${newArgs.shift()}`, style, '', ...newArgs);
    } else {
      logFn(`%c${label}`, style, ...args);
    }
  }
  function debug(...args: any[]) {
    if (disabled) return;
    print(console.debug, GREY_LABEL_STYLE, ...args);
  }
  function log(...args: any[]) {
    if (disabled) return;
    print(console.log, BLUE_LABEL_STYLE, ...args);
  }
  function warn(...args: any[]) {
    if (disabled) return;
    print(console.warn, YELLOW_LABEL_STYLE, ...args);
  }
  function error(...args: any[]) {
    if (disabled) return;
    print(console.error, RED_LABEL_STYLE, ...args);
  }

  return {
    print,
    debug,
    log,
    warn,
    error,
    groupCollapsed(
      label: string,
      callback: (fns: {
        log: LogFn;
        warn: LogFn;
        error: LogFn;
        debug: LogFn;
      }) => void,
    ) {
      if (!disabled) print(console.groupCollapsed, BLUE_LABEL_STYLE, label);
      callback({ debug, log, warn, error });
      if (!disabled) console.groupEnd();
    },
  };
}

export const GREY_LABEL_STYLE =
  'color: black; background-color: #d8d8d8; padding: 2px 4px; border-radius: 2px; font-weight: bold';
export const BLUE_LABEL_STYLE =
  'color: black; background-color: #4ec4f6; padding: 2px 4px; border-radius: 2px; font-weight: bold';
export const PURPLE_LABEL_STYLE =
  'color: black; background-color: #bda2e7; padding: 2px 4px; border-radius: 2px; font-weight: bold';
export const YELLOW_LABEL_STYLE =
  'color: black; background-color: #fde065; padding: 2px 4px; border-radius: 2px; font-weight: bold';
export const RED_LABEL_STYLE =
  'color: black; background-color: #fd6579; padding: 2px 4px; border-radius: 2px; font-weight: bold';

type LogFn = typeof console.log;
