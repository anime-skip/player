const manifest = {
  ...require('./manifest.json'),
  version: require('../package.json').version,
};

/**
 * `player_matches` - The URLs that the player interface should be injected onto. This also dictates
 *                    where the keyboard shortcut blocker is injected at since the player is where
 *                    those get added by the service
 * `parent_matches` - The URLs that the parent.ts file should be injected onto. For sites like VRV
 *                    that use HTML5 History Mode, this has to be a page that is loaded before the
 *                    page with the player (ie: `https://vrv.co/*` not `https://vrv.co/watch/*`)
 * `page_matches`   - The URLs that the anime skip page_action button should appear when you are
 *                    visiting
 */
const services = [
  {
    folder: 'example',
    player_matches: ['file:///*/example/index.html*'],
    parent_matches: ['file:///*/example/index.html*'],
    page_matches: ['file:///*/example/index.html*'],
  },
  {
    folder: 'vrv',
    player_matches: ['https://static.vrv.co/*'],
    parent_matches: ['https://vrv.co/*'],
    page_matches: ['https://vrv.co/*'],
  },
  {
    folder: 'funimation',
    player_matches: ['https://www.funimation.com/player/*'],
    parent_matches: ['https://www.funimation.com/shows/*'],
    page_matches: ['https://www.funimation.com/*'],
  },
  {
    folder: 'crunchyroll',
    player_matches: ['https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*'],
    parent_matches: ['https://www.crunchyroll.com/*'],
    page_matches: ['https://www.crunchyroll.com/*'],
  },
];

services.forEach(service => {
  // Keyboard blocker for each service
  manifest.content_scripts.push({
    matches: service.player_matches,
    js: ['content-scripts/keyboard-blocker.js'],
    run_at: 'document_start',
    all_frames: true,
  });

  // Parent for each service
  manifest.content_scripts.push({
    matches: service.parent_matches,
    js: ['browser-polyfill.js', `content-scripts/${service.folder}/parent.js`],
    all_frames: false,
  });

  // Player for each service
  manifest.content_scripts.push({
    matches: service.player_matches,
    js: [
      'browser-polyfill.js',
      'content-scripts/all.js',
      `content-scripts/${service.folder}/index.js`,
      'player/index.js',
    ],
    css: ['player/index.css', `content-scripts/${service.folder}/index.css`],
    all_frames: true,
  });

  // Add urls to the page_action
  manifest['{{firefox}}.page_action'].show_matches.push(...service.page_matches);
});

// Update dev stuff
if (process.env.NODE_ENV === 'development') {
  manifest['{{chrome}}.browser_action'].default_title += ' Nightly';
  manifest['{{firefox}}.page_action'].default_title += ' Nightly';
  manifest.name += ' Nightly';
  manifest.description = 'Development Build - ' + manifest.description;
}

// Add "(Beta)" if build is for beta. For now, always add it
// eslint-disable-next-line no-constant-condition
if (process.env.BETA === 'true' || true) {
  manifest.name += ' (Beta)';
}

// Filter fields for the given browser
const browser = (process.env.BUILD_FOR || '').toLowerCase();
if (!browser) throw "Include a 'BUILD_FOR=firefox|chrome' environment variable";

/**
 * Address all `{{browser}}.` prefixes, removing fields for other browsers and removing that tag for
 * fields for the specified browser
 */
function resolveBrowserTagsInObject(object) {
  if (Array.isArray(object)) {
    return object.map(item => resolveBrowserTagsInObject(item));
  } else if (typeof object === 'object') {
    return Object.keys(object).reduce((newObject, key) => {
      if (!key.startsWith('{{') || key.startsWith(`{{${browser}}}.`)) {
        newObject[key.replace(`{{${browser}}}.`, '')] = resolveBrowserTagsInObject(object[key]);
      }
      return newObject;
    }, {});
  } else {
    return object;
  }
}

const filteredManifest = resolveBrowserTagsInObject(manifest);

module.exports = {
  manifest: filteredManifest,
  services,
};
