import { Body, Controller, Get, HttpCode, Post, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens } from '../common/interfaces/tokens.interface';
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
   * Creates and returns a new User
   *
   * @param {CreateUserDto} createUserDto new user informations
   * @returns {Promise<User>} created user
   * @memberof UsersController
   */
  @Post()
  public async create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return await this._usersService.create(createUserDto);
  }

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

  /**
   * Logs in a user
   *
   * @param {LoginDto} loginDto connection informations (login/password)
   * @returns {Promise<Tokens>} API tokens (access and refresh)
   * @memberof UsersController
   */
  @Post('/login')
  @HttpCode(200)
  public async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<Tokens> {
    return await this._usersService.login(loginDto);
  }
}
