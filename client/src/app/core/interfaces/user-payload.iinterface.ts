/**
 * User possible roles
 *
 * @export
 * @enum {string}
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}


/**
 * User payload
 *
 * @export
 * @interface IUserPayload
 */
export interface IUserPayload {
  /**
   * User id
   *
   * @type {string}
   * @memberof IUserPayload
   */
  _id: string;

  /**
   * User login
   *
   * @type {string}
   * @memberof IUserPayload
   */
  login: string;

  /**
   * User roles array
   *
   * @type {UserRole[]}
   * @memberof IUserPayload
   */
  roles: UserRole[];
}
