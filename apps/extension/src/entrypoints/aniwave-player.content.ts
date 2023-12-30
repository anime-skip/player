import '~/assets/aniwave-player.scss';
import { ColorTheme } from '@anime-skip/player';

export default defineContentScript({
  matches: [
    // Retrived via apps/inspector
    // Examples:
    // - https://mcloud.bz/e/v4q086?t=4xjQCvwgBVMNyg%3D%3D&autostart=true
    // - https://mcloud.bz/e/44984m?t=4xjQCvwgBVIJyw%3D%3D&autostart=true
    // - https://mcloud.bz/e/k67wqv?t=4xjQCvwgBVIPzA%3D%3D&autostart=true
    // - https://mcloud.bz/e/28k175?t=4xjQCvwgBV0Nzg%3D%3D&autostart=true
    '*://mcloud.bz/e/*',
    // Examples:
    // - https://www.mp4upload.com/embed-mtqaqzd5zhhj.html?t=4xjQCvwgBVAAyg%3D%3D&autostart=true
    // - https://www.mp4upload.com/embed-fju9ap45vhkm.html?t=4xjQCvwgBVIKyg%3D%3D&autostart=true
    // - https://www.mp4upload.com/embed-le1p76slo00f.html?t=4xjQCvwgBVIAyw%3D%3D&autostart=true
    '*://www.mp4upload.com/embed-*',
    // Examples:
    // - https://vidplay.online/e/X1P201Z5EJ62?t=4xjQCvwgBVMOyA%3D%3D&autostart=true
    // - https://vidplay.online/e/ZLPGMR7MZP7X?t=4xjQCvwgBVIIzQ%3D%3D&autostart=true
    // - https://vidplay.online/e/83P7841G7JLE?t=4xjQCvwgBVIPzw%3D%3D&autostart=true
    // - https://vidplay.online/e/QVY9WZQ9EY2M?t=4xjQCvwgBV0LxQ%3D%3D&autostart=true
    '*://vidplay.online/e/*',
  ],
  allFrames: true,

  async main(ctx) {
    // Aniwave sometimes makes you press the play button, and we need to wait until you press it and the video shows up.
    await waitUntil(
      () => Promise.resolve(!!document.querySelector('video')),
      Infinity,
      1,
      100,
    );

    // Load player
    initExtensionPlayer({
      ctx,
      serviceName: 'Aniwave',
      parentElement: 'body',
    });
  },
});
