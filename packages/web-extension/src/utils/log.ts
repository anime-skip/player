import { createLogger, PURPLE_LABEL_STYLE } from '~utils/createLogger';

const { debug, error, groupCollapsed, print, log, warn } = createLogger(
  '@anime-skip/web-extension',
  import.meta.env.DEV
);

function loadedLog(file: string): void {
  if (import.meta.env.DEV) return;
  print(console.log, PURPLE_LABEL_STYLE, `Loaded ${file}`);
}

export { debug, error, groupCollapsed, log, warn, loadedLog };
