const manifest = {
  ...require('./manifest.json'),
  version: require('../package.json').version,
};

const { services } = require('./common/utils/CompileTimeConstants');

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
      `content-scripts/${service.folder}/globals.js`,
      'player/index.js',
    ],
    css: ['player/index.css', `content-scripts/${service.folder}/globals.css`],
    all_frames: true,
  });

  // Add urls to the page_action for firefox
  manifest['page_action']['{{firefox}}.show_matches'].push(...service.page_matches);
  manifest['{{chrome}}.host_permissions'].push(...service.page_matches);
});

/**
 * Address all `{{browser}}.` prefixes, removing fields for other browsers and removing that tag for
 * fields for the specified browser
 */
function resolveBrowserTagsInObject(browser, object) {
  if (Array.isArray(object)) {
    return object.map(item => resolveBrowserTagsInObject(browser, item)).filter(item => !!item);
  } else if (typeof object === 'object') {
    return Object.keys(object).reduce((newObject, key) => {
      if (!key.startsWith('{{') || key.startsWith(`{{${browser}}}.`)) {
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

module.exports = {
  getManifest(nameVariants, browser, mode) {
    const newManifest = resolveBrowserTagsInObject(browser, manifest);

    if (nameVariants.length > 0) {
      newManifest.name += ` (${nameVariants.join(', ')})`;
    }
    if (mode === 'dev') {
      newManifest['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
    }

    return newManifest;
  },
  services,
};
