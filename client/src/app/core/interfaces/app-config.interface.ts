export interface IAppConfig {
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
   * @memberof IAppConfig
   */
  apiBase: string;

  /**
   * Activates invitation code for signup
   *
   * @type {boolean}
   * @memberof IAppConfig
   */
  signupInvitationCode: boolean;
}
