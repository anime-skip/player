console.info('Injection script for example/index.html');

function getRootQuery(): string {
  return '.video-container';
}

// tslint:disable-next-line:no-var-keyword
var video = document.querySelector('#video') as HTMLVideoElement;
video.autoplay = false;
video.controls = false;

function getElementsToHide(): HTMLElement[] {
  return [
    document.querySelector('.glass') as HTMLElement,
  ];
}
