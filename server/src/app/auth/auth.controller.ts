import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from '../common/dto';
import { AUTH_COOKIE_NAME } from '../config/config.constants';
import { ConfigService } from '../config/config.service';

import { AuthService } from './auth.service';
import { CookieAuthGuard } from './guards/cookie.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  /**
   * Authentication cookie name
   *
   * @private
   * @type {string}
   * @memberof AuthController
   */
  private authCookieName: string;

  constructor(private readonly _authService: AuthService, private _configService: ConfigService) {
    this.authCookieName = this._configService.get(AUTH_COOKIE_NAME);
  }

  /**
   * Signs up a new user with its informations
   *
   * @param {Response} res response to send
   * @param {CreateUserDto} user user credentials
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  @Post('signup')
  public async signUp(@Res() res, @Body(ValidationPipe) user: CreateUserDto): Promise<void> {
    res.cookie(this.authCookieName, await this._authService.signUp(user), { httpOnly: true });
    res.status(HttpStatus.NO_CONTENT).send();
  }

  /**
   * Logs in a user with its credentials
   *
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(): Promise<void> {
    // res.cookie(this._configService.get(CSRF_COOKIE_NAME), req.)
  }

  /**
   * Refreshes an expired access token
   *
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  @Post('refresh')
  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async refresh(): Promise<void> {}
}
