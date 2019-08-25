/* eslint-disable @typescript-eslint/no-unused-vars */
console.info('Injection script for VRV');

// @ts-ignore
function getRootQuery(): string {
  return 'body>div';
}

// @ts-ignore
function getVideoQuery(): string {
  return 'video';
}

document.body.classList.add('hide-for-anime-skip');
