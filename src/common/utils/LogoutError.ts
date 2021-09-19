export class LogoutError extends Error {
  constructor() {
    super('Access token and refresh token have expired, user should be logged out');
  }
}
