import { Controller, Get, Next, Res } from '@nestjs/common';
import { join } from 'path';

import { STATIC_FOLDER, STATIC_SERVE } from '../common/constants';
import { ConfigService } from '../common/services';

/**
 * Controller to serve index of client application
 *
 * @export
 * @class ClientController
 */
@Controller()
export class ClientController {
  constructor(private readonly _configService: ConfigService) {}
  /**
   * Returns index page for client app
   *
   * @param {*} res response to send
   * @memberof ClientController
   */
  @Get()
  public index(@Res() res, @Next() next): void {
    if (this._configService.get(STATIC_SERVE)) {
      res.sendFile(join(this._configService.get(STATIC_FOLDER), 'index.html'));
    } else next();
  }
}
