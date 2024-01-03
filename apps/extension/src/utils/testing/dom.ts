import { Window } from 'happy-dom';
import { resolve } from 'path';
import fs from 'node:fs/promises';

export async function createDomFromFile(
  ...path: string[]
): Promise<typeof document> {
  const window = await new Window({
    settings: {
      disableJavaScriptEvaluation: true,
      disableIframePageLoading: true,
      disableJavaScriptFileLoading: true,
      disableCSSFileLoading: true,
    },
  });
  const file = await fs.readFile(resolve(...path), 'utf-8');
  window.document.body.innerHTML = file;
  return window.document as unknown as typeof document;
}
