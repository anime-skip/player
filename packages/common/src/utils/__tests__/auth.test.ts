import { describe, expect, it } from 'vitest';
import { parseJwt } from '../auth';

describe('Auth Utils', () => {
  describe('parseJwt', () => {
    it('should return the payload of an access token', () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbmltZS1za2lwLmNvbSIsImV4cCI6MTYzNDUyMzY3MSwiaWF0IjoxNjM0NDgwNDcxLCJpc3MiOiJhbmltZS1za2lwLmNvbSIsInJvbGUiOjIsInVzZXJJZCI6IjM4OWEzNzQ5LWM4ZjQtNGUzOS1iZjVmLTk2YzFjMjQ1MjA3NCJ9.signature';
      expect(parseJwt(jwt)).toEqual({
        aud: 'anime-skip.com',
        exp: 1634523671,
        iat: 1634480471,
        iss: 'anime-skip.com',
        role: 2,
        userId: '389a3749-c8f4-4e39-bf5f-96c1c2452074',
      });
    });

    it('should return the payload of a refresh token', () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbmltZS1za2lwLmNvbS9ncmFwaHFsP2xvZ2luUmVmcmVzaCIsImV4cCI6MTYzODYyNjg3MSwiaWF0IjoxNjM4MDIyMDcxLCJpc3MiOiJhbmltZS1za2lwLmNvbSIsInVzZXJJZCI6IjgyNTk1MTk5LTFlZDItNDlhMy04YzA2LWYwMmYwZGRlNzU1YSJ9.signature';
      expect(parseJwt(jwt)).toEqual({
        aud: 'anime-skip.com/graphql?loginRefresh',
        exp: 1638626871,
        iat: 1638022071,
        iss: 'anime-skip.com',
        userId: '82595199-1ed2-49a3-8c06-f02f0dde755a',
      });
    });
  });
});
