import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-cookie';
import { User } from 'src/app/users/interfaces/user.interface';

import { AuthService } from '../auth.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({
      cookieName: 'auth',
      signed: true,
      passReqToCallback: false,
    });
  }

  public async validate(token: string, done: (error: Error | null, user: boolean | User) => void) {
    try {
      const signedUser = await this._authService.verify(token);
      return done(null, signedUser || false);
    } catch (err) {
      done(err, false);
    }
  }
}

const callback = (err, user, info) => {
  let message;
  if (err) {
    return err || new UnauthorizedException(info.message);
  } else if (typeof info !== 'undefined' || !user) {
    switch (info.message) {
      case 'No auth token':
      case 'invalid signature':
      case 'jwt malformed':
      case 'invalid token':
      case 'invalid signature':
        message = 'You must provide a valid authenticated access token';
        break;
      case 'jwt expired':
        message = 'Your session has expired';
        break;
      default:
        message = info.message;
        break;
    }
    throw new UnauthorizedException(message);
  }
  return user;
};
