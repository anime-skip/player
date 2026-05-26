import type {
  ContentScriptDefinition,
  IsolatedWorldContentScriptDefinition,
  PerBrowserOption,
} from 'wxt';
import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { MatchPattern } from 'wxt/utils/match-patterns';

export function defineSpaContentScript(
  options: IsolatedWorldContentScriptDefinition,
): ContentScriptDefinition {
  return {
    ...options,
    matches: toDomainMatches(options.matches),

    main(parentContext: ContentScriptContext): any {
      // Importing ContentScriptContext's value here would cause the build to fail, so we get the class from the parent context instead.
      const Context = parentContext.constructor as typeof ContentScriptContext;

      const childMatches = toMatchPatterns(options.matches);
      let childContext: ContentScriptContext | undefined;

      const isUrlMatch = (url: string | URL | Location) =>
        childMatches?.some((match) => match.includes(url));

      const run = (url: string, initial?: boolean) => {
        const isMatch = isUrlMatch(url);
        const wasMatch = !!childContext;
        if (isMatch && wasMatch) {
          if (import.meta.env.DEV)
            console.debug(
              '[wxt] SPA site still on matching page, re-running content script main function to make sure it is initialized',
            );
          void options.main(childContext!);
        } else if (isMatch && !wasMatch) {
          if (import.meta.env.DEV)
            if (initial)
              console.debug(
                '[wxt] SPA site loaded on matching page, running content script main function',
              );
            else
              console.debug(
                '[wxt] SPA navigated to matching page, running content script main function',
              );
          childContext = new Context(
            // @ts-expect-error: Private member
            parentContext.contentScriptName + '-spa-child',
            options,
          );
          void options.main(childContext);
        } else if (!isMatch && wasMatch) {
          if (import.meta.env.DEV)
            console.debug(
              '[wxt] SPA navigated off matching page, stopping content script',
            );
          childContext!.abort('SPA navigated off matching page');
          childContext = undefined;
        } else {
          if (import.meta.env.DEV)
            if (initial)
              console.debug(
                '[wxt] Ignoring initial load of SPA site on non-matching page',
              );
            else
              console.debug(
                '[wxt] Ignoring SPA navigation between non-matching pages',
              );
        }
      };

      // Run it for the initial URL
      run(location.href, true);

      // Setup the listener to re-run the content script on URL change
      // @ts-expect-error: Private member
      parentContext.locationWatcher.run();
      parentContext.addEventListener(window, 'wxt:locationchange', (event) => {
        if (import.meta.env.DEV) console.debug('[wxt] SPA URL changed:', event);
        void run(event.newUrl.href);
      });
    },
  };
}

function toDomainMatches(
  matches: PerBrowserOption<string[]> | undefined,
): string[] | undefined {
  if (matches == null) return matches;

  if (Array.isArray(matches)) return [...new Set(matches.map(toDomainMatch))];

  // TODO: Read options from parent content script context options, which should already apply per-browser options
  throw Error('Per-browser options not supported by SPA content scripts');
}

function toDomainMatch(pattern: string): string {
  if (pattern === '<all_urls>' || pattern.startsWith('file:')) return pattern;

  const slashSlashIndex = pattern.indexOf('//');
  const startIndex = slashSlashIndex + 2;
  const pathnameStart = pattern.indexOf('/', startIndex);

  return pattern.slice(0, pathnameStart) + '/*';
}

function toMatchPatterns(
  matches: PerBrowserOption<string[]> | undefined,
): MatchPattern[] | undefined {
  if (matches == null) return matches;

  if (Array.isArray(matches))
    return matches.map((pattern) => new MatchPattern(pattern));

  throw Error('Per-browser options not supported by SPA content scripts');
}
