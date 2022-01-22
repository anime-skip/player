import { error } from './log';

function escapeForRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function convertPatternToRegex(pattern: string): RegExp {
  const escaped = escapeForRegex(pattern);
  const starsReplaced = escaped.replace(/\\\*/g, '.*');
  return RegExp(`^${starsReplaced}$`);
}

export function urlPatternMatch(
  pattern: string,
  url: { hostname: string; protocol: string; pathname: string }
): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [_, protocol, host, path] = /(.*:)\/\/(.*?)(\/.*)/.exec(pattern)!;
    const protocolRegex = convertPatternToRegex(protocol);
    const hostRegex = convertPatternToRegex(host);
    const pathRegex = convertPatternToRegex(path);
    return (
      !!protocolRegex.exec(url.protocol) &&
      !!hostRegex.exec(url.hostname) &&
      !!pathRegex.exec(url.pathname)
    );
  } catch (err) {
    error(err);
    return false;
  }
}
