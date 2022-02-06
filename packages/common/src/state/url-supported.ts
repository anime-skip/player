import { ParentHosts } from '../utils/compile-time-constants';
import { urlPatternMatch } from '../utils/strings';

const supportedPatterns = Object.values(ParentHosts).map(urlPattern => {
  const hostPatternRegex = /^(.*:\/\/[\w.]+)\/.*$/;
  const match = urlPattern.match(hostPatternRegex);

  if (match?.[1]) return match[1] + '/*';
  return urlPattern;
});

export function isUrlSupported(url: string) {
  const uri = new URL(url);
  for (const pattern of supportedPatterns) {
    if (urlPatternMatch(pattern, uri)) {
      return true;
    }
  }
  return false;
}
