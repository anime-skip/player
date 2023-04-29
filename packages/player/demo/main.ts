import { createPlayer } from '../src';

// Set a custom video for development from a .env file
const videoUrl =
  import.meta.env.VITE_VIDEO_SRC ||
  'https://archive.org/download/big-bunny-sample-video/SampleVideo.mp4';
document.querySelector('video')!.src = videoUrl;

// Load and mount the player
const player = createPlayer({
  serviceName: 'Development',
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
});
player.mount('.video-container');
