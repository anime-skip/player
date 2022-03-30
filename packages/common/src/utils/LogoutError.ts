import { parseJwt } from './auth';

export class LogoutError extends Error {
  constructor(
    private readonly token: string | undefined,
    private readonly refreshToken: string | undefined,
    public apiError: string | undefined
  ) {
    super('Access token and refresh token have expired, user should be logged out');
  }

  tokenExpiresAt(): number | undefined {
    if (!this.token) return undefined;
    try {
      return parseJwt(this.token).exp;
    } catch (err) {
      this.apiError = 'Invalid token: ' + this.token;
      return undefined;
    }
  }

  refreshTokenExpiresAt(): number | undefined {
    if (!this.refreshToken) return undefined;
    try {
      return parseJwt(this.refreshToken).exp;
    } catch (err) {
      this.apiError = 'Invalid refreshToken: ' + this.refreshToken;
      return undefined;
    }
  }
}
