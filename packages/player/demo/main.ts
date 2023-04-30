import { createPlayer } from '../src';

const getShowName = (): HTMLElement => document.getElementById('show')!;
const getEpisodeName = (): HTMLElement => document.getElementById('episode')!;
const getSeason = (): HTMLElement => document.getElementById('season')!;
const getNumber = (): HTMLElement => document.getElementById('number')!;
const getAbsoluteNumber = (): HTMLElement =>
  document.getElementById('absolute-number')!;

// Set the episode info from env
if (import.meta.env.VITE_SHOW_NAME)
  getShowName().textContent = import.meta.env.VITE_SHOW_NAME;
if (import.meta.env.VITE_EPISODE_NAME)
  getEpisodeName().textContent = import.meta.env.VITE_EPISODE_NAME;
if (import.meta.env.VITE_SEASON)
  getSeason().textContent = import.meta.env.VITE_SEASON;
if (import.meta.env.VITE_NUMBER)
  getNumber().textContent = import.meta.env.VITE_NUMBER;
if (import.meta.env.VITE_ABSOLUTE_NUMBER)
  getAbsoluteNumber().textContent = import.meta.env.VITE_ABSOLUTE_NUMBER;

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
      showName: getShowName().textContent,
      episodeName: getEpisodeName().textContent,
      season: getSeason().textContent,
      number: getNumber().textContent,
      absoluteNumber: getAbsoluteNumber().textContent,
    };
  },
  fullscreenElement: '.video-container',
});
player.mount('.video-container');
