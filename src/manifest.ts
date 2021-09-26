import type { Manifest } from 'webextension-polyfill-ts';
import pkg from '../package.json';
import { services } from './common/utils/CompileTimeConstants';
import manifestTemplate from './manifest.template.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveBrowserTagsInObject(browser: SupportedBrowser, object: any): any {
  if (Array.isArray(object)) {
    return object.map(item => resolveBrowserTagsInObject(browser, item)).filter(item => !!item);
  } else if (typeof object === 'object') {
    return Object.keys(object).reduce((newObject, key) => {
      if (!key.startsWith('{{') || key.startsWith(`{{${browser}}}.`)) {
        // @ts-expect-error: bad key typing
        newObject[key.replace(`{{${browser}}}.`, '')] = resolveBrowserTagsInObject(
          browser,
          object[key]
        );
      }
      return newObject;
    }, {});
  } else if (typeof object === 'string') {
    if (!object.startsWith('{{') || object.startsWith(`{{${browser}}}.`)) {
      return object.replace(`{{${browser}}}.`, '');
    }
    return undefined;
  } else {
    return object;
  }
}

export async function getManifest(
  nameSuffix: string | undefined,
  browser: SupportedBrowser,
  mode: 'prod' | 'beta' | 'staged' | 'dev'
): Promise<Manifest.WebExtensionManifest> {
  // Fill out missing fields from template
  const extName = pkg.displayName + (nameSuffix ?? '');
  const manifest: Manifest.WebExtensionManifest = {
    ...manifestTemplate,
    name: extName,
    version: pkg.version,
    description: pkg.description,
    content_security_policy:
      mode === 'dev'
        ? `script-src 'self'; object-src 'self'` // old: "script-src 'self' 'unsafe-eval'; object-src 'self'"
        : undefined,
  };
  if (manifest.page_action) {
    manifest.page_action.default_title = extName;
  }

  // Apply dynamic service content scripts
  services.forEach(service => {
    // Keyboard blocker for each service
    manifest.content_scripts?.push({
      matches: service.player_matches,
      js: ['content-scripts/keyboard-blocker/index.js'],
      run_at: 'document_start',
      all_frames: true,
    });

    // Parent for each service
    manifest.content_scripts?.push({
      matches: service.parent_matches,
      js: [`content-scripts/services/${service.folder}/parent.js`],
      all_frames: false,
    });

    // Player for each service
    manifest.content_scripts?.push({
      matches: service.player_matches,
      js: [
        `content-scripts/services/${service.folder}/index.js`,
        'content-scripts/all/index.js',
        'content-scripts/player/index.js',
      ],
      css: [
        `content-scripts/services/${service.folder}/style.css`,
        'content-scripts/player/style.css',
      ],
      all_frames: true,
    });

    // Make service page URLs effect the page action on each browser
    // @ts-expect-error: browser specific types not available on typing
    manifest['page_action']['{{firefox}}.show_matches'].push(...service.page_matches);

    // For chrome manifest v3, remove {{firefox}}. from host permissions in template
    if (manifest.manifest_version === 3) {
      // @ts-expect-error: browser specific types not available on typing
      manifest['{{chrome}}.host_permissions'].push(...service.page_matches);
    }
  });

  // Remove browser specific config
  const resolvedManifest: Manifest.WebExtensionManifest = resolveBrowserTagsInObject(
    browser,
    manifest
  );

  // Add permissions to make API calls from localhost during development
  if (mode === 'dev') {
    resolvedManifest.permissions?.push('http://localhost/*');
    // @ts-expect-error: Typing only for firefox, chrome specific fields missing
    resolvedManifest.host_permissions?.push('http://localhost:8081/*');
  }

  // Remove duplicates from manifest fields
  if (resolvedManifest.page_action?.show_matches) {
    resolvedManifest.page_action.show_matches = Array.from(
      new Set(resolvedManifest.page_action.show_matches).values()
    );
  }

  return resolvedManifest;
}
