export interface IAppConfig {
  /**
   * API server URL
   *
   * @type {string}
   * @memberof AppConfig
   */
  apiURL: string;

  /**
   * Activates invitation code for signup
   *
   * @type {boolean}
   * @memberof IAppConfig
   */
  signupInvitationCode: boolean;
}
