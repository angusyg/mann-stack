import { UserRole } from 'src/app/users/interfaces/user.interface';

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
   * User roles
   *
   * @type {UserRole[]}
   * @memberof Payload
   */
  roles: UserRole[];
}
