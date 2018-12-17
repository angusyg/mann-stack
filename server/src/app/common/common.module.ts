import { Global, Module } from '@nestjs/common';

import { ConfigService, MailService } from './services';
import { IsValidInvitationCodeConstraint } from './validators';

/**
 * Global module for common services
 *
 * @export
 * @class CommonModule
 */
@Global()
@Module({
  providers: [ConfigService, MailService, IsValidInvitationCodeConstraint],
  exports: [ConfigService, MailService],
})
export class CommonModule {}
