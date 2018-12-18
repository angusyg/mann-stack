import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignupDto } from '../../../dtos';
import { Payload } from '../../../interfaces';
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
  constructor(private readonly _authService: AuthService, private readonly _jwtService: JwtService) {}

  /**
   * Sets CSRF Cookie for CSRF protection
   *
   * @param {*} req request
   * @param {*} res response to send
   * @memberof AuthController
   */
  @Get('csrf')
  public async initCsrf(@Req() req, @Res() res): Promise<void> {
    const token = this._authService.setCsrfCookie(req, res);
    res.status(HttpStatus.OK).send({ token });
  }

  /**
   * Signs up a new user with its informations
   *
   * @param {Response} res response to send
   * @param {SignupDto} signupDto user credentials
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  @Post('signup')
  public async signUp(@Req() req, @Res() res, @Body(ValidationPipe) signupDto: SignupDto): Promise<void> {
    const token = await this._authService.signUp(signupDto);
    this._authService.setAuthCookie(res, token);
    this._authService.setCsrfCookie(req, res);
    res.status(HttpStatus.OK).send(this._extractUserPayload(token));
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
  public login(@Req() req, @Res() res): void {
    res.status(HttpStatus.OK).send(this._extractUserPayload(req.token));
  }

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

  /**
   * Logout user, destroying auth cookie
   *
   * @param {*} res response to send
   * @memberof AuthController
   */
  @Get('logout')
  public logout(@Res() res): void {
    this._authService.removeAuthCookie(res);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  /**
   * Extracts user payload from JWT token
   *
   * @private
   * @param {string} token JWT token
   * @memberof AuthController
   */
  private _extractUserPayload(token: string): Payload {
    const payload = this._jwtService.decode(token, {}) as Payload;
    delete payload.refresh;
    return payload;
  }
}
