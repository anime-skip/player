import { JSDOM } from 'jsdom';
import { join } from 'path';

export async function createDomFromFile(...path: string[]): Promise<typeof document> {
  const dom = await JSDOM.fromFile(join(...path));
  return dom.window.document;
}
