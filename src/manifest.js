const manifest = {
  ...require('./manifest.json'),
  version: require('../package.json').version,
};

/**
 * `player_matches` - The URLs that the player interface should be injected onto. This also dictates
 *                    where the keyboard shortcut blocker is injected at since the player is where
 *                    those get added by the service
 * `parent_matches` - The URLs that the parent.ts file should be injected onto
 * `page_matches`   - The URLs that the anime skip page_action button should appear when you are
 *                    visiting
 */
const services = [
  {
    folder: 'example',
    player_matches: ['file:///*/example/index.html'],
    parent_matches: ['file:///*/example/index.html'],
    page_matches: ['file:///*/example/index.html'],
  },
  {
    folder: 'vrv',
    player_matches: ['https://static.vrv.co/*'],
    parent_matches: ['https://vrv.co/watch/*/*'],
    page_matches: ['https://vrv.co/*'],
  },
  {
    folder: 'funimation',
    player_matches: ['https://www.funimation.com/player/*'],
    parent_matches: ['https://www.funimation.com/shows/*'],
    page_matches: ['https://www.funimation.com/*'],
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
  manifest.page_action.show_matches.push(...service.page_matches);
});

if (process.env.NODE_ENV !== 'production') {
  manifest.name += ' Nightly';
  manifest.description = 'Development Build - ' + manifest.description;
}

module.exports = {
  manifest,
  services,
};
