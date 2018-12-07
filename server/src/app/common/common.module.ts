import { Global, Module } from '@nestjs/common';

import { ConfigService, MailService } from './services';

/**
 * Global module for common services
 *
 * @export
 * @class CommonModule
 */
@Global()
@Module({
  providers: [ConfigService, MailService],
  exports: [ConfigService, MailService],
})
export class CommonModule {}
