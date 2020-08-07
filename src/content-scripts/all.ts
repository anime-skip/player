/* eslint-disable @typescript-eslint/no-unused-vars */
console.log('INJECTED content-scripts/all.ts');

const videoCallbacks: ((video: HTMLVideoElement) => void)[] = [];

global.onVideoChanged = (callback: (video: HTMLVideoElement) => void): void => {
  videoCallbacks.push(callback);
};

global.getVideo = (): HTMLVideoElement => {
  return document.querySelector(global.getVideoQuery()) as HTMLVideoElement;
};

let oldVideoSrc: string | undefined;
function checkVideoChanged(): void {
  const newVideo = global.getVideo();
  if (newVideo?.src !== oldVideoSrc) {
    console.log('Video changed, calling callbacks:', {
      oldVideo: oldVideoSrc,
      newVideo: newVideo.src,
      videoCallbacks,
    });
    videoCallbacks.forEach(callback => {
      try {
        callback(newVideo);
      } catch (err) {
        console.error('onVideoChangedCallback failed', err);
      }
    });
    oldVideoSrc = newVideo.src;
  }
}

setInterval(checkVideoChanged, 1000);
