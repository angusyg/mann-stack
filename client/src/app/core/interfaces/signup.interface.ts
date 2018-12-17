export interface ISignupInfos {
  /**
   * User pseudonyme
   *
   * @type {string}
   * @memberof ISignupInfos
   */
  login: string;

  /**
   * User password
   *
   * @type {string}
   * @memberof ISignupInfos
   */
  password: string;

  /**
   * User confirmation password
   *
   * @type {string}
   * @memberof ISignupInfos
   */
  passwordConf: string;

  /**
   * User email
   *
   * @type {string}
   * @memberof ISignupInfos
   */
  email: string;

  /**
   * Invitation code
   *
   * @type {string}
   * @memberof ISignupInfos
   */
  invitationCode: string;
}
