function escapeForRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function urlPatternMatch(
  pattern: string,
  url: { hostname: string; protocol: string; pathname: string }
): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [_, protocol, host, path] = /(.*:)\/\/(.*?)(\/.*)/.exec(pattern)!;
    const protocolRegex = RegExp('^' + escapeForRegex(protocol).replace(/\\\*/g, '.*') + '$');
    const hostRegex = RegExp('^' + escapeForRegex(host).replace(/\\\*/g, '.*') + '$');
    const pathRegex = RegExp('^' + escapeForRegex(path).replace(/\\\*/g, '.*') + '$');
    return (
      !!protocolRegex.exec(url.protocol) &&
      !!hostRegex.exec(url.hostname) &&
      !!pathRegex.exec(url.pathname)
    );
  } catch (err) {
    console.error(err);
    return false;
  }
}
