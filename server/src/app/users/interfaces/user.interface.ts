import { Document } from '../../common/interfaces';

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
 * User informations
 *
 * @export
 * @interface User
 * @extends {Document}
 */
export interface User extends Document {
  /**
   * User login
   *
   * @type {string}
   * @memberof User
   */
  login: string;

  /**
   * User password
   *
   * @type {string}
   * @memberof User
   */
  password: string;

  /**
   * User email
   *
   * @type {string}
   * @memberof User
   */
  email: string;

  /**
   * User roles
   *
   * @type {UserRole[]}
   * @memberof User
   */
  roles: UserRole[];

  /**
   * User refresh token
   *
   * @type {string}
   * @memberof User
   */
  refreshToken: string;

  /**
   * Compares a candidate password with user password
   *
   * @param {string} candidatePassword candidate password
   * @return {Promise<boolean>} match result
   * @memberof User
   */
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}
