export default async function CaptureScreenshot(
  video: HTMLVideoElement,
  width?: number
): Promise<string> {
  let w: number, h: number;
  if (!width) {
    w = video.videoWidth;
    h = video.videoHeight;
  } else {
    const ratio = video.videoHeight / video.videoWidth;
    w = width;
    h = ratio * width;
  }
  const x = 0;
  const y = 0;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    throw Error('Canvas context was undefined');
  }

  ctx?.drawImage(video, x, y, w, h);
  return canvas.toDataURL();
}
