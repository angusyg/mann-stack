import { Module } from '@nestjs/common';

import { ClientController } from './client.controller';

/**
 * Module to serve client application if static serve is activated
 *
 * @export
 * @class ClientModule
 */
@Module({
  controllers: [ClientController],
})
export class ClientModule {}
