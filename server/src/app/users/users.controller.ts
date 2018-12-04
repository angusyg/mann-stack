import { Controller, Get } from '@nestjs/common';

import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

/**
 * Controller for User resource
 *
 * @export
 * @class UsersController
 */
@Controller('/users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  /**
   * Retrieves all existing users
   *
   * @returns {Promise<User[]>} existing users
   * @memberof UsersController
   */
  @Get()
  public async findAll(): Promise<User[]> {
    return await this._usersService.findAll();
  }
}
