import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as uuid from 'uuid';

import {
  AUTH_COOKIE_MAXAGE,
  AUTH_COOKIE_NAME,
  AUTH_JWT_EXPIRATION_DELAY,
  AUTH_MAIL_CONFIRMATION,
  CSRF_COOKIE_MAXAGE,
  CSRF_COOKIE_NAME,
  MAIL_USER,
  URL,
} from '../../../../common/constants';
import { ConfigService, MailService } from '../../../../common/services';
import { CreateUserDto } from '../../../dtos';
import { Payload, User, UserStatus } from '../../../interfaces';
import { Logger } from '../../logger/services';
import { UsersService } from '../../users/services';

/**
 * Service to handle user creation and authentication
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _logger: Logger,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _mailService: MailService
  ) {}

  /**
   * Signs up a new user
   *
   * @param {CreateUserDto} user new user
   * @returns {Promise<string>} API access token
   * @memberof AuthService
   */
  public async signUp(createUserDto: CreateUserDto): Promise<string> {
    this._logger.debug(`Creating new user with ${{ login: createUserDto.login, email: createUserDto.email }}`);
    // Creates new user in db
    const newUser = await this._usersService.create(createUserDto);
    if (this._configService.get(AUTH_MAIL_CONFIRMATION)) {
      // Email verification, sends email and save confirmation token for user
      try {
        // Sends confirmation email
        newUser.confirmToken = await this.sendConfirmEmail(newUser);
      } catch (err) {
        // Deletes created user if error sending confirmation email
        await this._usersService.deleteById(newUser._id);
        throw err;
      }
    }
    // If no email verification needed, activates account
    else newUser.status = UserStatus.ACTIVE;
    // Generates access token
    return await this.getAccessToken(newUser);
  }

  /**
   * Checks logins informations for user to connect
   *
   * @param {LoginDto} infos connection infos (login/password)
   * @returns {Promise<Uer>} logged in user
   * @memberof AuthService
   */
  public async logIn(login: string, password: string): Promise<User> {
    this._logger.debug(`Trying to log in user with login '${login}'`);
    const user = await this._usersService.findOne({ login }, true);
    // If no user found, rejects
    if (!user) throw new UnauthorizedException('BAD_LOGIN');
    // Password comparison beetween user password and given one
    const match = await user.comparePassword(password);
    // If passwords don't match, reject
    if (!match) throw new UnauthorizedException('BAD_PASSWORD');
    return user;
  }

  /**
   * Searches for user from JWT payload
   *
   * @param {Payload} payload JWT payload
   * @returns {Promise<User>} owner of JWT
   * @memberof AuthService
   */
  public async verify(token: string): Promise<User | null> {
    // Verifies token
    const payload = this._jwtService.verify<Payload>(token);
    // Extracts user from db with _id in token
    return await this._usersService.findOne({ _id: payload._id });
  }

  /**
   * Generates an access token with user infos
   *
   * @param {User} user user associated to token to create
   * @returns {Promise<string>} API access token
   * @memberof AuthService
   */
  public async getAccessToken(user: User): Promise<string> {
    // Generates new refresh token for user
    user.refreshToken = uuid.v4();
    // Updates user with his new refresh token
    await user.save();
    // Returns with tokens
    return this.generateAccessToken(user, user.refreshToken);
  }

  /**
   * Refreshes and expired access token
   *
   * @param {*} req request to extract access token from
   * @returns {Promise<string>} new ccess token
   * @memberof AuthService
   */
  public async refreshAccessToken(req: any): Promise<string> {
    // Decodes access token
    const payload = this._jwtService.decode(req.cookies[this._configService.get(AUTH_COOKIE_NAME)], { json: true }) as Payload;
    if (!payload) throw new UnauthorizedException('INVALID_TOKEN');
    // Searches for user with login and refresh token extracted from expired access token
    const user = await this._usersService.findOne({ _id: payload._id, refreshToken: payload.refresh });
    // If no user found, rejects
    if (!user) throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    // Generates new access token
    return this.getAccessToken(user);
  }

  /**
   * Confirms email of user with its token
   *
   * @param {string} token confirmation token
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public async confirmEmail(token: string): Promise<void> {
    // Searches user associated to token
    const user = await this._usersService.findOne({ confirmToken: token });
    // If no user founds, rejects
    if (!user) throw new UnauthorizedException('INVALID_CONFIRM_TOKEN');
    // If user is not already activated
    if (user.status === UserStatus.INACTIVE) {
      // Updates user status
      user.status = UserStatus.ACTIVE;
      await user.save();
    }
  }

  /**
   * Sets auth cookie on response
   *
   * @param {*} res response to send
   * @param {string} value access token
   * @memberof AuthService
   */
  public setAuthCookie(res: any, value: string): void {
    res.cookie(this._configService.get(AUTH_COOKIE_NAME), value, {
      httpOnly: true,
      maxAge: this._configService.get(AUTH_COOKIE_MAXAGE),
    });
  }

  /**
   * Sets CSRF token cookie
   *
   * @param {*} req request
   * @param {*} res response to send
   * @memberof AuthService
   */
  public setCsrfCookie(req: any, res: any): void {
    res.cookie(this._configService.get(CSRF_COOKIE_NAME), req.csrfToken(), { httpOnly: false, maxAge: this._configService.get(CSRF_COOKIE_MAXAGE) });
  }

  /**
   * Generates an access token with user infos
   *
   * @param {User} user user associated to token to create
   * @returns {Promise<string>} JWT access token as string
   * @memberof AuthService
   */
  private generateAccessToken(user: User, refreshToken: string): string {
    this._logger.debug(`Generating access token for user with login '${user.login}'`);
    return this._jwtService.sign(
      {
        _id: user._id,
        login: user.login,
        refresh: refreshToken,
      },
      { expiresIn: this._configService.get(AUTH_JWT_EXPIRATION_DELAY) }
    );
  }

  /**
   * Generates a token and sends it in an email for email verification
   *
   * @private
   * @param {User} user user to verify email
   * @returns {Promise<string>} generated token
   * @memberof AuthService
   */
  private async sendConfirmEmail(user: User): Promise<string> {
    // Generates a confirmation token
    const token = randomBytes(48).toString('hex');
    // Creates mail
    const mailOptions = {
      from: this._configService.get(MAIL_USER),
      to: user.email,
      subject: 'E-mail verification',
      text: `Hi, To confirm you email <a href="${this._configService.get(URL)}/auth/confirm/${encodeURIComponent(token)}">Clik on this link</a>`,
    };
    // Sends mail
    await this._mailService.sendMail(mailOptions);
    return token;
  }
}
