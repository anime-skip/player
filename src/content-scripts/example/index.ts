/* eslint-disable @typescript-eslint/no-unused-vars */
import "./style.scss";

console.info("INJECTED content-scripts/example/index.ts");

global.getRootQuery = (): string => {
  return '.video-container';
}

global.getVideoQuery = (): string => {
  return '#video';
}
