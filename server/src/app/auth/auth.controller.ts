import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';

import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../common/constants';
import { CreateUserDto } from '../common/dto';

import { AuthService } from './auth.service';
import { CookieAuthGuard } from './guards/cookie.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  public async signUp(@Res() res, @Body(ValidationPipe) user: CreateUserDto): Promise<void> {
    const tokens = await this._authService.signUp(user);
    res.cookie(AUTH_COOKIE_NAME, tokens.accessToken, { httpOnly: true });
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, { httpOnly: true });
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('login')
  @UseGuards(CookieAuthGuard)
  public async login(@Req() req, @Res() res): Promise<void> {
    const tokens = await this._authService.generateTokens(req.user);
    res.cookie(AUTH_COOKIE_NAME, tokens.accessToken, { httpOnly: true });
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, { httpOnly: true });
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
