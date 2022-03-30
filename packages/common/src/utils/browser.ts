import UaParser from 'ua-parser-js';

/**
 * Return which browser this code is running on
 */
export function detectBrowser(): string | undefined {
  return new UaParser(navigator.userAgent).getBrowser().name?.toLowerCase();
}
