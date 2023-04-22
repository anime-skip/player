import { createPlayer } from '@anime-skip/player';

const player = createPlayer({
  serviceName: 'Demo',
  getEpisodeInfo() {
    return {
      showName: document.getElementById('show')?.textContent,
      season: document.getElementById('season')?.textContent,
      episodeName: document.getElementById('episode')?.textContent,
      number: document.getElementById('number')?.textContent,
      absoluteNumber: document.getElementById('absolute-number')?.textContent,
    };
  },
  fullscreenElement: '.video-container',
  getEpisodeUrl: () =>
    'https://www.crunchyroll.com/watch/G9DUEGNDM/guardians-of-the-crimson-demon-village',
});
player.mount('.video-container');
