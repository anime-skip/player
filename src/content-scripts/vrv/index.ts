/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.scss';

console.log('INJECTED content-scripts/vrv/index.ts');

global.service = 'vrv';
global.getRootQuery = (): string => {
  return 'body>div';
};
global.getVideoQuery = (): string => {
  return 'video';
};

document.body.classList.add('hide-for-anime-skip');
