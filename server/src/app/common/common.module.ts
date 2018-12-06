import { Global, Module } from '@nestjs/common';

import { MailService } from './providers/mail.service';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class CommonModule {}
