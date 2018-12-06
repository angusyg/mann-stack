import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from '../common/dto';
import { AUTH_COOKIE_NAME } from '../config/config.constants';
import { ConfigService } from '../config/config.service';

import { AuthService } from './auth.service';
import { CookieAuthGuard } from './guards/cookie.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('api/auth')
export class AuthController {
  /**
   * Authentication cookie name
   *
   * @private
   * @type {string}
   * @memberof AuthController
   */
  private _authCookieName: string;

  constructor(private readonly _authService: AuthService, private readonly _configService: ConfigService) {
    this._authCookieName = this._configService.get(AUTH_COOKIE_NAME);
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
    res.cookie(this._authCookieName, await this._authService.signUp(user), { httpOnly: true });
    res.status(HttpStatus.NO_CONTENT).send();
  }

  /**
   * Confirms user email
   *
   * @param {string} token confirmation token
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  @Get('confirm/:token')
  public async confirmEmail(@Param('token') token): Promise<void> {
    await this._authService.confirmEmail(token);
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
  public async login(): Promise<void> {}

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
