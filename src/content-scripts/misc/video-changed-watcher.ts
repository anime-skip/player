import { loadedLog } from '~/common/utils/loadedLog';

export function initVideoChangeWatcher() {
  loadedLog('content-scripts/misc/video-changed-watcher');

  const videoCallbacks: ((video: HTMLVideoElement) => void)[] = [];

  window.onVideoChanged = (callback: (video: HTMLVideoElement) => void): void => {
    videoCallbacks.push(callback);
  };

  window.getVideo = (): HTMLVideoElement => {
    return document.querySelector(window.getVideoQuery()) as HTMLVideoElement;
  };

  let oldVideoSrc: string | undefined;
  function checkVideoChanged(): void {
    if (window.getVideo == null) {
      throw new Error('Cannot check if video has changed when window.getVideo has not been set');
    }
    const newVideo = window.getVideo();
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
}
