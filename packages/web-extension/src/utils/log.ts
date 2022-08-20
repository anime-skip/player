import { createLogger, PURPLE_LABEL_STYLE } from '~utils/createLogger';

const SHOULD_LOG =
  EXTENSION_MODE === 'dev' || EXTENSION_MODE === 'test' || EXTENSION_MODE === 'staged';

const { debug, error, groupCollapsed, print, log, warn } = createLogger(
  '@anime-skip/web-extension',
  SHOULD_LOG
);

function loadedLog(file: string): void {
  if (SHOULD_LOG) return;
  print(console.log, PURPLE_LABEL_STYLE, `Loaded ${file}`);
}

export { debug, error, groupCollapsed, log, warn, loadedLog };
