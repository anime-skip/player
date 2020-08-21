/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.scss';

console.log('INJECTED content-scripts/funimation/index.ts');

global.service = 'funimation';
global.getRootQuery = (): string => {
  return 'body>div';
};
global.getVideoQuery = (): string => {
  return 'video';
};

document.body.classList.add('hide-for-anime-skip');
