export interface Payload {
  /**
   * User id
   *
   * @type {string}
   * @memberof Payload
   */
  _id: string;

  /**
   * User login
   *
   * @type {string}
   * @memberof Payload
   */
  login: string;

  /**
   * User refresh token
   *
   * @type {string}
   * @memberof Payload
   */
  refresh: string;
}
