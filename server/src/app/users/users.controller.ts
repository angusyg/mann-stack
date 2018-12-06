import { Controller, Get } from '@nestjs/common';

import { User } from '../common/interfaces/user.interface';
import { UsersService } from './users.service';

/**
 * Controller for User resource
 *
 * @export
 * @class UsersController
 */
@Controller('api/users')
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
