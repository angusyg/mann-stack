import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';

/**
 * Controller to serve index of client application
 *
 * @export
 * @class AppController
 */
@Controller()
export class AppController {
    /**
     * Returns index page for client app
     *
     * @param {*} res response to send
     * @memberof AppController
     */
    @Get()
    public index(@Res() res): void {
      res.sendFile(join(__dirname, '../../../client/src/index.html'));
    }
}
