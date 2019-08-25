/* eslint-disable @typescript-eslint/no-unused-vars */
const videoCallbacks: ((video: HTMLVideoElement) => void)[] = [];

function onVideoChanged(callback: (video: HTMLVideoElement) => void): void {
  videoCallbacks.push(callback);
}

function getVideo(): HTMLVideoElement {
  return document.querySelector(getVideoQuery()) as HTMLVideoElement;
}

let oldVideo: HTMLVideoElement | undefined;
function checkVideoChanged(): void {
  const newVideo = getVideo();
  if (newVideo != null && newVideo !== oldVideo) {
    console.info('Video changed!', { oldVideo, newVideo });
    videoCallbacks.forEach(callback => callback(newVideo));
  }
  oldVideo = newVideo;
}
setInterval(checkVideoChanged, 1000);
