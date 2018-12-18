/**
 * User sign up infos
 *
 * @export
 * @interface SignupInfos
 */
export interface SignupInfos {
  /**
   * User pseudonyme
   *
   * @type {string}
   * @memberof SignupInfos
   */
  login: string;

  /**
   * User password
   *
   * @type {string}
   * @memberof SignupInfos
   */
  password: string;

  /**
   * User confirmation password
   *
   * @type {string}
   * @memberof SignupInfos
   */
  passwordConf: string;

  /**
   * User email
   *
   * @type {string}
   * @memberof SignupInfos
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
