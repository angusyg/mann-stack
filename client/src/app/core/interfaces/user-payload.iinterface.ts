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
 * @interface UserPayload
 */
export interface UserPayload {
  /**
   * User id
   *
   * @type {string}
   * @memberof UserPayload
   */
  _id: string;

  /**
   * User login
   *
   * @type {string}
   * @memberof UserPayload
   */
  login: string;

  /**
   * User roles array
   *
   * @type {UserRole[]}
   * @memberof UserPayload
   */
  roles: UserRole[];
}
