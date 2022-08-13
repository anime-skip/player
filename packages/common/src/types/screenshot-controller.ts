import { Component } from 'vue';

export type ScreenshotController = Component<{
  mouseOver: boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
}>;
