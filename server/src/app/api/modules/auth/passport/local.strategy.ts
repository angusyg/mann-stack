import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '../../../interfaces';
import { Logger } from '../../logger/services';
import { AuthService } from '../services';

/**
 * Passport local strategy
 * Searches a user with login password matching sent informations
 *
 * @export
 * @class LocalStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService, private readonly _logger: Logger) {
    super({
      usernameField: 'login',
      passReqToCallback: false,
    });
  }

  /**
   * Validates connection with login and password
   * Searches in the db, a user with given login and password
   *
   * @param {string} login user login
   * @param {string} password user password
   * @param {((error: Error | null, user: boolean | User) => void)} done callback function
   * @returns {Promise<void>}
   * @memberof LocalStrategy
   */
  public async validate(login: string, password: string, done: (error: Error | null, user: boolean | User) => void): Promise<void> {
    try {
      // Searchs the db a user by its login, and verifies if its password matches password
      const user = await this._authService.logIn(login, password);
      // If no user found, send error
      if (!user) return done(new UnauthorizedException('USER_NOT_FOUND'), false);
      // Sends logged user
      return done(null, user);
    } catch (err) {
      // Converts error message to request result message
      this._logger.error('Error while connecting user', err);
      if (err instanceof UnauthorizedException) return done(err, false);
      return done(new UnauthorizedException('AUTH_ERROR'), false);
    }
  }
}
