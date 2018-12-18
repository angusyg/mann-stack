/**
 * Application configuration
 *
 * @export
 * @interface AppConfig
 */
export interface AppConfig {
  /**
   * API server URL
   *
   * @type {string}
   * @memberof AppConfig
   */
  serverURL: string;

  /**
   * API base path
   *
   * @type {string}
   * @memberof AppConfig
   */
  apiBase: string;

  /**
   * Activates invitation code for signup
   *
   * @type {boolean}
   * @memberof AppConfig
   */
  signupInvitationCode: boolean;
}
