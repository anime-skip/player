/* eslint-disable @typescript-eslint/no-unused-vars */
import "./style.scss";

console.info("INJECTED content-scripts/vrv/index.ts");

global.getRootQuery = (): string => {
  return 'body>div';
}

// @ts-ignore
global.getVideoQuery = (): string => {
  return 'video';
}

document.body.classList.add('hide-for-anime-skip');
