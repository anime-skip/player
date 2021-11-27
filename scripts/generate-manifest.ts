import merge from 'lodash.merge';
import { readJsonFile } from 'vite-plugin-web-extension';
import { Manifest } from 'webextension-polyfill';
import {
  PAGE_ACTION_MATCHES,
  ParentHosts,
  PlayerHosts,
} from '../src/common/utils/compile-time-constants';
import { rootPath } from './utils';

interface GenerateManifestConfig {
  mode: ExtensionMode;
  browser: SupportedBrowser;
}

const suffixes: Record<ExtensionMode, string> = {
  prod: '',
  beta: ' (Beta)',
  staged: ' (Staged)',
  test: ' (Dev)',
  dev: ' (Dev)',
};

export function generateManifest(config: GenerateManifestConfig): Manifest.WebExtensionManifest {
  const manifestTemplate = readJsonFile(rootPath('src/manifest.template.json'));
  const pkg = readJsonFile(rootPath('package.json'));
  const name = pkg.displayName + suffixes[config.mode];
  const contentScriptMatches = new Set([
    ...Object.values(ParentHosts),
    ...Object.values(PlayerHosts),
  ]);

  return merge(manifestTemplate, {
    name,
    description: pkg.description,
    version: pkg.version,
    page_action: {
      default_title: name,
      '{{firefox}}.show_matches': PAGE_ACTION_MATCHES,
    },
    content_scripts: [
      {
        matches: Array.from(contentScriptMatches.values()),
      },
      {
        matches: Object.values(PlayerHosts),
      },
    ],
  });
}
