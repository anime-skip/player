import merge from 'lodash.merge';
import { readJsonFile } from 'vite-plugin-web-extension';
import { Manifest } from 'webextension-polyfill';
import { services } from '../src/common/utils/CompileTimeConstants';
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

  const manifest = merge(manifestTemplate, {
    name,
    description: pkg.description,
    version: pkg.version,
    page_action: {
      default_title: name,
    },
  });

  // Apply dynamic service content scripts
  services.forEach(service => {
    // Keyboard blocker for each service
    manifest.content_scripts?.push({
      matches: service.player_matches,
      js: ['content-scripts/keyboard-blocker/index.ts'],
      run_at: 'document_start',
      all_frames: true,
    });

    // Parent for each service
    manifest.content_scripts?.push({
      matches: service.parent_matches,
      js: [`content-scripts/services/${service.folder}/parent.ts`],
      all_frames: false,
    });

    // Player for each service
    manifest.content_scripts?.push({
      matches: service.player_matches,
      js: [
        `content-scripts/services/${service.folder}/init-player.ts`,
        'content-scripts/all/index.ts',
        'content-scripts/player/index.ts',
      ],
      css: [
        `generated:content-scripts/services/${service.folder}/style.css`,
        'generated:content-scripts/player/style.css',
      ],
      all_frames: true,
    });

    // Make service page URLs effect the page action on each browser
    manifest['page_action']['{{firefox}}.show_matches'].push(...service.page_matches);
  });

  return manifest;
}
