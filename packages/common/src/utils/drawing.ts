import { ScreenshotDetails } from '../types';

export function fallbackBound(...values: (number | undefined)[]): number {
  return values.find(value => value != null && !isNaN(value)) ?? 0;
}

export function centerFitVideoBounds(
  elementBounds: ScreenshotDetails,
  videoWidth: number,
  videoHeight: number
): ScreenshotDetails {
  let aspectRatioWOverH = videoWidth / videoHeight;
  if (isNaN(aspectRatioWOverH)) aspectRatioWOverH = 1;

  let finalWidth: number;
  let finalHeight: number;

  const heightScaledWidth = elementBounds.height * aspectRatioWOverH;
  const widthScaledHeight = elementBounds.width / aspectRatioWOverH;

  if (heightScaledWidth <= elementBounds.width) {
    finalWidth = heightScaledWidth;
    finalHeight = elementBounds.height;
  } else {
    finalWidth = elementBounds.width;
    finalHeight = widthScaledHeight;
  }

  const left = elementBounds.left + (elementBounds.width - finalWidth) / 2;
  const top = elementBounds.top + (elementBounds.height - finalHeight) / 2;

  return {
    width: fallbackBound(finalWidth),
    height: fallbackBound(finalHeight),
    left: fallbackBound(left),
    top: fallbackBound(top),
  };
}
