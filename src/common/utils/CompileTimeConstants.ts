export const services = [
  {
    folder: 'test-service',
    player_matches: ['http://localhost/*'],
    parent_matches: ['http://localhost/*'],
    page_matches: ['http://localhost/*'],
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
