import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/app/users/interfaces/user.interface';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({
      usernameField: 'login',
      passReqToCallback: false,
    });
  }

  public async validate(login: string, password: string, done: (error: Error | null, user: boolean | User) => void) {
    try {
      const user = await this._authService.logIn(login, password);
      if (user) done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}

export const callback = (err, user, info) => {
  if (typeof info !== 'undefined') {
    throw new UnauthorizedException(info.message);
  } else if (err || !user) {
    throw err || new UnauthorizedException();
  }
  return user;
};
