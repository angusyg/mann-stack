import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { CreateUserDto } from '../common/dto';
import { Payload } from '../common/interfaces';
import { AUTH_JWT_EXPIRATION_DELAY } from '../config/config.constants';
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
   * @returns {Promise<string>} API access token
   * @memberof AuthService
   */
  public async signUp(createUserDto: CreateUserDto): Promise<string> {
    this._logger.debug(`Creating new user with ${{ login: createUserDto.login, email: createUserDto.email }}`);
    // Creates new user in db
    const newUser = await this._usersService.create(createUserDto);
    return await this.getAccessToken(newUser);
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
   * @returns {Promise<string>} API access token
   * @memberof AuthService
   */
  public async getAccessToken(user: User): Promise<string> {
    // Generates new refresh token for user
    user.refreshToken = uuid.v4();
    // Updates user with his new refresh token
    await (user as Model<User>).save();
    // Returns with tokens
    return this.generateAccessToken(user, user.refreshToken);
  }

  /**
   * Refreshes and expired access token
   *
   * @param {string} token expired access token to refresh
   * @returns {Promise<string>} new ccess token
   * @memberof AuthService
   */
  public async refreshAccessToken(token: string): Promise<string> {
    // Decodes access token
    const payload = this._jwtService.decode(token, { json: true }) as Payload;
    if (payload) {
      // Searches for user with login and refresh token extracted from expired access token
      const user = await this._usersService.findOne({ _id: payload._id, refreshToken: payload.refresh });
      // If no user found, rejects
      if (!user) throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
      // Generates new access token
      return this.getAccessToken(user);
    } throw new UnauthorizedException('INVALID_TOKEN');
  }

  /**
   * Generates an access token with user infos
   *
   * @param {User} user user associated to token to create
   * @returns {Promise<string>} JWT access token as string
   * @memberof AuthService
   */
  private generateAccessToken(user: User, refreshToken: string): string {
    this._logger.debug(`Generating access token for user with login '${user.login}'`);
    return this._jwtService.sign(
      {
        _id: user._id,
        login: user.login,
        refresh: refreshToken,
      },
      { expiresIn: this._configService.get(AUTH_JWT_EXPIRATION_DELAY) }
    );
  }
}
