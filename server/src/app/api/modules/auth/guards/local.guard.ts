import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
  constructor(private readonly _authService: AuthService) {
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
    // Generates new access token
    const token = await this._authService.getAccessToken(request.user);
    // Set new refreshed token in auth cookie
    this._authService.setAuthCookie(response, token);
    // Generates and sets csrf cookie
    this._authService.setCsrfCookie(request, response);
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
