import { Global, Module } from '@nestjs/common';

import { ConfigService } from './services';

/**
 * Gloabl module for configuration load and validation
 *
 * @export
 * @class ConfigModule
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
