import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-cookie';

import { AUTH_COOKIE_NAME } from '../../common/constants';
import { User } from '../../common/interfaces';
import { ConfigService } from '../../config/services';
import { Logger } from '../../logger/services';
import { AuthService } from '../services';

/**
 * Passport cookie strategy
 * Based on auth cookie, containing JWT access token
 *
 * @export
 * @class CookieStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy) {
  // @ts-ignore: noUnusedLocals
  constructor(private readonly _configService: ConfigService, private readonly _authService: AuthService, private readonly _logger: Logger) {
    super({
      cookieName: _configService.get(AUTH_COOKIE_NAME),
      passReqToCallback: false,
    });
  }

  /**
   * Validates token extracted from cookie
   * Verifies token and tries to retrieve associated user from database
   *
   * @param {string} token access token extracted from cookie
   * @param {((error: Error | null, user: boolean | User) => void)} done callback function
   * @returns {Promise<void>}
   * @memberof CookieStrategy
   */
  public async validate(token: string, done: (error: Error | null, user: boolean | User) => void): Promise<void> {
    try {
      // Verifies token and extracts user from db
      const signedUser = await this._authService.verify(token);
      // If no user found, send error
      if (!signedUser) return done(new UnauthorizedException('USER_NOT_FOUND'), false);
      // Sends logged user
      return done(null, signedUser);
    } catch (err) {
      // Converts error message to request result message
      this._logger.error('Error while verifying JWT token', err.message);
      let message;
      switch (err.message) {
        case 'jwt expired':
          message = 'EXPIRED_TOKEN';
          break;
        case 'No auth token':
        case 'invalid signature':
        case 'jwt malformed':
        case 'invalid token':
        case 'invalid signature':
        default:
          message = 'TOKEN_ERROR';
          break;
      }
      return done(new UnauthorizedException(message), false);
    }
  }
}
