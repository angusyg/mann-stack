import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { USER_MODEL_TOKEN } from '../common/common.constants';
import { CreateUserDto } from '../common/dto';
import { Logger } from '../logger/logger.service';

import { User } from '../common/interfaces/user.interface';

/**
 * Service to handle User resource
 *
 * @export
 * @class UsersService
 */
@Injectable()
export class UsersService {
  constructor(@Inject(USER_MODEL_TOKEN) private readonly _userModel: Model<User>, private _logger: Logger) {}

  /**
   * Creates a new User
   *
   * @param {CreateUserDto} createUserDto user to create
   * @returns {Promise<User>} resolved with created user
   * @memberof UsersService
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    this._logger.debug(`Creating new user with ${{ login: createUserDto.login, email: createUserDto.email }}`);
    return await this._userModel.create(createUserDto);
  }

  /**
   * Retrieves all existing users
   *
   * @returns {Promise<User[]>} list of existing users
   * @memberof UsersService
   */
  public async findAll(): Promise<User[]> {
    this._logger.debug('Retrieving all users');
    return await this._userModel.find().exec();
  }

  /**
   * Retrieves a user according to search parameters
   * If asked, it can populate password field
   *
   * @param {*} params search parameters
   * @param {boolean} [withPassword] flag to activate password retrieval
   * @returns {Promise<User>} found user
   * @memberof UsersService
   */
  public async findOne(params: any, withPassword?: boolean): Promise<User> {
    if (withPassword) {
      return await this._userModel
        .findOne(params)
        .select('+password')
        .exec();
    }
    return await this._userModel.findOne(params).exec();
  }

  /**
   * Finds a user by its id and deletes it
   *
   * @param {string} id user if
   * @memberof UsersService
   */
  public async deleteById(id: string) {
    await this._userModel.findByIdAndRemove(id).exec();
  }
}
