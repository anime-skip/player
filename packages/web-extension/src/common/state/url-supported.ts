import { PAGE_ACTION_MATCHES } from '../utils/compile-time-constants';
import { urlPatternMatch } from '../utils/strings';

export function isUrlSupported(url: string) {
  const uri = new URL(url);
  for (const pattern of PAGE_ACTION_MATCHES) {
    if (urlPatternMatch(pattern, uri)) {
      return true;
    }
  }
  return false;
}
