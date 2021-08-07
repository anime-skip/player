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
module.exports.services = [
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
    parent_matches: ['https://www.funimation.com/*'],
    page_matches: ['https://www.funimation.com/*'],
  },
  {
    folder: 'crunchyroll',
    player_matches: ['https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*'],
    parent_matches: ['https://www.crunchyroll.com/*', 'https://beta.crunchyroll.com/*'],
    page_matches: ['https://www.crunchyroll.com/*', 'https://beta.crunchyroll.com/*'],
  },
];
