import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_COOKIE_MAXAGE, AUTH_COOKIE_NAME } from '../../common/constants';
import { ConfigService } from '../../config/services';
import { AuthService } from '../services';

/**
 * Auth Guard using passport local strategy
 *
 * @export
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly _configService: ConfigService, private readonly _authService: AuthService) {
    super();
  }

  /**
   * Tries to log in user with credentials
   * If authentication succeeds, it sets auth cookie
   *
   * @param {ExecutionContext} context route context
   * @returns{Promise<boolean>} result of validation
   * @memberof LocalAuthGuard
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Tries to log in user with credentials
    await super.canActivate(context);
    // If ok, sets auth cookie
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    // Generates and sets cookie
    response.cookie(this._configService.get(AUTH_COOKIE_NAME), await this._authService.getAccessToken(request.user), {
      httpOnly: true,
      maxAge: this._configService.get(AUTH_COOKIE_MAXAGE),
    });
    return true;
  }

  /**
   * Handles validation result
   *
   * @param {Error} err authentication error
   * @param {any} user connected user
   * @returns {any} connected user
   * @memberof LocalAuthGuard
   */
  public handleRequest(err: Error, user: any): any {
    if (err || !user) throw err || new UnauthorizedException('AUTH_FAILED');
    return user;
  }
}
