import { Global, Module } from '@nestjs/common';

import { MailService } from './services';

/**
 * Global module for common services
 *
 * @export
 * @class CommonModule
 */
@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class CommonModule {}
