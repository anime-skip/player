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
  if (global.getVideo == null) {
    throw new Error('Cannot check if video has changed when global.getVideo has not been set');
  }
  const newVideo = global.getVideo();
  if (newVideo?.src !== oldVideoSrc) {
    console.debug('Video changed, calling callbacks:', {
      oldVideo: oldVideoSrc,
      newVideo: newVideo.src,
      videoCallbacks,
    });
    videoCallbacks.forEach(callback => {
      try {
        callback(newVideo);
      } catch (err) {
        console.warn('onVideoChangedCallback failed', err);
      }
    });
    oldVideoSrc = newVideo.src;
  }
}

setInterval(checkVideoChanged, 1000);
