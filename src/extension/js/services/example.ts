/* eslint-disable @typescript-eslint/no-unused-vars */
console.info('Injection script for example/index.html');

// @ts-ignore
function getRootQuery(): string {
  return '.video-container';
}

// @ts-ignore
function getVideoQuery(): string {
  return '#video';
}

var video = document.querySelector('#video') as HTMLVideoElement;

// @ts-ignore
function getElementsToHide(): HTMLElement[] {
  return [document.querySelector('.glass') as HTMLElement];
}
