/** Immediately download a screenshot from a URL (usually a data URL). */
export function downloadScreenshot(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = `Anime Skip Screenshot ${new Date().toISOString()}.jpeg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
