import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from '../../../dtos';
import { CookieAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';

/**
 * Controller for authentication endpoints
 *
 * @export
 * @class AuthController
 */
@Controller()
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * Sets CSRF Cookie for CSRF protection
   *
   * @param {*} req request
   * @param {*} res response to send
   * @memberof AuthController
   */
  @Get('csrf')
  public async initCsrf(@Req() req, @Res() res): Promise<void> {
    this._authService.setCsrfCookie(req, res);
    res.status(HttpStatus.NO_CONTENT).send();
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
  public async signUp(@Req() req, @Res() res, @Body(ValidationPipe) user: CreateUserDto): Promise<void> {
    const token = await this._authService.signUp(user);
    this._authService.setAuthCookie(res, token);
    this._authService.setCsrfCookie(req, res);
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
  public async refresh(@Req() req, @Res() res): Promise<void> {
    if (!req.refreshed) {
      // If no refresh in guard, generates new access token
      const token = await this._authService.refreshAccessToken(req);
      // Set new refreshed token in auth cookie
      this._authService.setAuthCookie(res, token);
    }
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
