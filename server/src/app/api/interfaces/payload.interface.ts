import { UserRole } from './user.interface';

/**
 * JWT access token payload
 *
 * @export
 * @interface Payload
 */
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
   * User roles array
   *
   * @type {UserRole[]}
   * @memberof Payload
   */
  roles: UserRole[];

  /**
   * User refresh token
   *
   * @type {string}
   * @memberof Payload
   */
  refresh: string;
}
