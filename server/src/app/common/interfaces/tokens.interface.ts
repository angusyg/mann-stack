/**
 * Tokens for authenticated API access
 *
 * @export
 * @interface Tokens
 */
export interface Tokens {
  /**
   * Access token (JWT Token)
   *
   * @type {string}
   * @memberof Tokens
   */
  accessToken: string;

  /**
   * Refresh token (UUID)
   *
   * @type {string}
   * @memberof Tokens
   */
  refreshToken: string;
}
