import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Auth Guard using passport local strategy
 *
 * @export
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
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
