import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './interfaces/tokens.interface';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('UserModelToken') private readonly userModel: Model<User>, private configService: ConfigService, private logger: Logger) {}

  /**
   * Creates a new User
   *
   * @param {CreateUserDto} createUserDto user to create
   * @returns {Promise<User>} resolved with created user
   * @memberof UsersService
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    // Creates and converts to object to delete password field before returning new user
    const createdCat = (await this.userModel.create(createUserDto)).toObject();
    // Deletes password field from result
    delete createdCat.password;
    return createdCat;
  }

  /**
   * Retrieves all existing users
   *
   * @returns {Promise<User[]>} list of existing users
   * @memberof UsersService
   */
  public async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  /**
   * Checks logins informations for user to connect
   *
   * @param {LoginDto} infos connection infos (login/password)
   * @returns {Promise<Tokens>}  resolved with api tokens, rejected on bad login or errors
   * @memberof UsersService
   */
  public async login(infos: LoginDto): Promise<Tokens> {
    this.logger.debug(`Trying to log in user with login '${infos.login}'`);
    // Search for user with given login
    const user = await this.userModel
      .findOne({ login: infos.login })
      .select('+password')
      .exec();
    // If no user found, rejects
    if (!user) throw new UnauthorizedException('BAD_LOGIN');
    // Password comparison beetween user password and given one
    const match = await user.comparePassword(infos.password);
    // If passwords don't match, reject
    if (!match) throw new UnauthorizedException('BAD_PASSWORD');
    // All good, creation of API tokens
    this.logger.debug(`Creating new refresh token for user with login '${user.login}'`);
    user.refreshToken = uuid.v4();
    // Updates user with his new refresh token
    await user.save();
    // Returns with tokens
    return {
      refreshToken: user.refreshToken,
      accessToken: this.generateAccessToken(user),
    };
  }

  /**
   * Generates an access token with user infos
   *
   * @private
   * @param {User} user
   * @returns {string}
   * @memberof UsersService
   */
  private generateAccessToken(user: User): string {
    this.logger.debug(`Generating access token for user with login '${user.login}'`);
    return jwt.sign(
      {
        id: user.id,
        login: user.login,
        roles: user.roles,
      },
      this.configService.get('JWT_SECRET'),
      { expiresIn: this.configService.get('JWT_EXPIRATION_DELAY') }
    );
  }
}
