import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Auth Guard using passport cookie strategy
 *
 * @export
 * @class CookieAuthGuard
 * @extends {AuthGuard('cookie')}
 */
@Injectable()
export class CookieAuthGuard extends AuthGuard('cookie') {
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
