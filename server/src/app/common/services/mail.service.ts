import { Injectable } from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

import { MAIL_PASSWORD, MAIL_USER } from '../../config/config.constants';
import { ConfigService } from '../../config/config.service';

/**
 * Service to send email
 *
 * @export
 * @class MailService
 */
@Injectable()
export class MailService {
  /**
   * Promisified send email function
   *
   * @private
   * @memberof MailService
   */
  private _transport: Transporter;

  constructor(private _configService: ConfigService) {
    this._transport = createTransport(smtpTransport({
      service: 'gmail',
      auth: { user: this._configService.get(MAIL_USER), pass: this._configService.get(MAIL_PASSWORD) },
    }));
  }

  /**
   * Sends an email
   *
   * @param {SendMailOptions} mailOptions mail informations
   * @memberof MailService
   */
  public async sendMail(mailOptions: SendMailOptions): Promise<void> {
    await this._transport.sendMail(mailOptions);
  }
}
