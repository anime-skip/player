/* eslint-disable @typescript-eslint/no-unused-vars */
console.info('INJECTED content-scripts/all.ts');

const videoCallbacks: ((video: HTMLVideoElement) => void)[] = [];

global.onVideoChanged = (callback: (video: HTMLVideoElement) => void): void => {
  videoCallbacks.push(callback);
};

global.getVideo = (): HTMLVideoElement => {
  return document.querySelector(global.getVideoQuery()) as HTMLVideoElement;
};

let oldVideo: HTMLVideoElement | undefined;
function checkVideoChanged(): void {
  const newVideo = global.getVideo();
  if (newVideo != null && (newVideo !== oldVideo || newVideo.src !== oldVideo.src)) {
    videoCallbacks.forEach(callback => callback(newVideo));
  }
  oldVideo = newVideo;
}

setInterval(checkVideoChanged, 1000);
