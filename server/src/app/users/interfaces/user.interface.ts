import { Document } from 'src/app/lib/interfaces/document.interface';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

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
}
