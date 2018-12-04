import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { CreateUserDto } from '../common/dto';
import { Payload, Tokens } from '../common/interfaces';
import { JWT_EXPIRATION_DELAY } from '../config/config.constants';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';
import { User } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';

/**
 * Service to handle user creation and authentication
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private _logger: Logger,
    private _configService: ConfigService,
    private readonly _jwtService: JwtService
  ) {}

  /**
   * Signs up a new user
   *
   * @param {CreateUserDto} user new user
   * @returns {Promise<Tokens>} API tokens (access and refresh tokens)
   * @memberof AuthService
   */
  public async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    this._logger.debug(`Creating new user with ${{ login: createUserDto.login, email: createUserDto.email }}`);
    // Creates new user in db
    const newUser = await this._usersService.create(createUserDto);
    return await this.generateTokens(newUser);
  }

  /**
   * Checks logins informations for user to connect
   *
   * @param {LoginDto} infos connection infos (login/password)
   * @returns {Promise<Uer>} logged in user
   * @memberof AuthService
   */
  public async logIn(login: string, password: string): Promise<User> {
    this._logger.debug(`Trying to log in user with login '${login}'`);
    const user = await this._usersService.findOne({ login }, true);
    // If no user found, rejects
    if (!user) throw new UnauthorizedException('BAD_LOGIN');
    // Password comparison beetween user password and given one
    const match = await user.comparePassword(password);
    // If passwords don't match, reject
    if (!match) throw new UnauthorizedException('BAD_PASSWORD');
    return user;
  }

  /**
   * Searches for user from JWT payload
   *
   * @param {Payload} payload JWT payload
   * @returns {Promise<User>} owner of JWT
   * @memberof AuthService
   */
  public async verify(token: string): Promise<User> {
    // Verifies token
    const payload = this._jwtService.verify<Payload>(token);
    // Extracts user from db with _id in token
    return await this._usersService.findOne({ _id: payload._id });
  }

  /**
   * Generates an access token with user infos
   *
   * @param {User} user user associated to token to create
   * @returns {Promise<Tokens>} API tokens (access and refresh)
   * @memberof AuthService
   */
  public async generateTokens(user: User): Promise<Tokens>  {
    // Generates new refresh token for user
    user.refreshToken = uuid.v4();
    // Updates user with his new refresh token
    await (user as Model<User>).save();
    // Returns with tokens
    return {
      refreshToken: user.refreshToken,
      accessToken: await this.generateAccessToken(user),
    };
  }

  /**
   * Generates an access token with user infos
   *
   * @param {User} user user associated to token to create
   * @returns {Promise<string>} JWT access token as string
   * @memberof AuthService
   */
  private async generateAccessToken(user: User): Promise<string> {
    this._logger.debug(`Generating access token for user with login '${user.login}'`);
    return this._jwtService.sign(
      {
        _id: user._id,
        login: user.login,
        roles: user.roles,
      },
      { expiresIn: this._configService.get(JWT_EXPIRATION_DELAY) }
    );
  }
}
