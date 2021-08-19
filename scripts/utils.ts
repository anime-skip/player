import { resolve } from 'path';

export function rootPath(...args: string[]): string {
  return resolve(__dirname, '..', ...args);
}
