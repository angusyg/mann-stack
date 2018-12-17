import { Global, Module } from '@nestjs/common';

import { Logger } from './services';

/**
 * Module for logging
 *
 * @export
 * @class LoggerModule
 */
@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
