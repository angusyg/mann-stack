import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_COOKIE_MAXAGE, AUTH_COOKIE_NAME } from 'src/app/config/config.constants';
import { ConfigService } from 'src/app/config/config.service';

import { AuthService } from '../auth.service';

/**
 * Auth Guard using passport cookie strategy
 *
 * @export
 * @class CookieAuthGuard
 * @extends {AuthGuard('cookie')}
 */
@Injectable()
export class CookieAuthGuard extends AuthGuard('cookie') {
  constructor(private _configService: ConfigService, private _authService: AuthService) {
    super();
  }

  /**
   * Tries to activate route
   * It checks auth cookie validity
   *
   * @param {ExecutionContext} context route context
   * @returns{Promise<boolean>} result of validation
   * @memberof CookieAuthGuard
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Tries to validate auth cookie
      await super.canActivate(context);
      return true;
    } catch (err) {
      // Error during validation
      if (err.message && err.message.message && err.message.message === 'EXPIRED_TOKEN') {
        // If token is expired, tries to refresh it
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const cookieName = this._configService.get(AUTH_COOKIE_NAME);
        // Set new refreshed token in auth cookie
        response.cookie(cookieName, await this._authService.refreshAccessToken(request.cookies[cookieName]), {
          httpOnly: true,
          maxAge: this._configService.get(AUTH_COOKIE_MAXAGE),
        });
        return true;
      }
      throw err;
    }
  }

  /**
   * Handles validation result
   *
   * @param {Error} err authentication error
   * @param {any} user connected user
   * @returns {any} connected user
   * @memberof CookieAuthGuard
   */
  public handleRequest(err: Error, user: any): any {
    if (err || !user) throw err || new UnauthorizedException('NO_AUTH_TOKEN');
    return user;
  }
}
