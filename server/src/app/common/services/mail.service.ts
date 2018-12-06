import { Injectable } from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

import { MAIL_PASSWORD, MAIL_USER } from '../../common/constants';
import { ConfigService } from '../../config/services';

/**
 * Service to send emails
 *
 * @export
 * @class MailService
 */
@Injectable()
export class MailService {
  /**
   * Mailer transporter
   *
   * @private
   * @type {Transporter}
   * @memberof MailService
   */
  private _transporter: Transporter;

  constructor(private _configService: ConfigService) {
    this._transporter = createTransport(
      smtpTransport({
        service: 'gmail',
        auth: { user: this._configService.get(MAIL_USER), pass: this._configService.get(MAIL_PASSWORD) },
      })
    );
  }

  /**
   * Sends an email
   *
   * @param {SendMailOptions} mailOptions mail informations
   * @memberof MailService
   */
  public async sendMail(mailOptions: SendMailOptions): Promise<void> {
    await this._transporter.sendMail(mailOptions);
  }
}
