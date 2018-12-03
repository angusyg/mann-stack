import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { CreateUserDto, LoginDto } from '../common/dto';
import { Payload, Tokens } from '../common/interfaces';
import { JWT_EXPIRATION_DELAY } from '../config/config.constants';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';
import { User } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';

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
   * @returns
   * @memberof AuthService
   */
  public async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    this._logger.debug(`Creating new user with ${{ login: createUserDto.login, email: createUserDto.email }}`);
    const newUser = await this._usersService.create(createUserDto);
    newUser.refreshToken = uuid.v4();
    // Updates user with his new refresh token
    await (newUser as Model<User>).save();
    // Returns with tokens
    return {
      refreshToken: newUser.refreshToken,
      accessToken: await this.generateAccessToken(newUser),
    };
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
   * Searchs for user from JWT payload
   *
   * @param {Payload} payload JWT payload
   * @returns {Promise<User>} owner of JWT
   * @memberof AuthService
   */
  public async verify(token: string): Promise<User> {
    const payload = this._jwtService.verify<Payload>(token);
    return await this._usersService.findOne({ _id: payload._id });
  }

  /**
   * Generates an access token with user infos
   *
   * @param {User} user
   * @returns {Promise<string>}
   * @memberof AuthService
   */
  public async generateAccessToken(user: User): Promise<string> {
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
