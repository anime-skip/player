import http from 'node:http';
import { ParentHosts } from '../src/common/utils/compile-time-constants';

function exit(err: any) {
  console.error(err);
  process.exit(1);
}

http.get('http://9anime.to', res => {
  if (res.statusCode !== 301) return exit(`Expected status code of 301, but got ${res.statusCode}`);

  const redirect = res.headers.location;
  if (!redirect)
    return exit(
      `No location header returned, but is required: ${JSON.stringify(res.headers, null, 2)}`
    );

  const actualDomain = new URL(redirect).hostname;
  const expectedDomain = new URL(ParentHosts.NINE_ANIME).hostname;
  if (actualDomain !== expectedDomain)
    return exit(
      `Player is configured for ${expectedDomain}, but 9anime's domain changed to ${actualDomain}`
    );

  console.log(`${expectedDomain} is still in use`);
});
