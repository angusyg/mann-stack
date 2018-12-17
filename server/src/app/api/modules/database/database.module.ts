import { Module } from '@nestjs/common';

import { databaseProviders } from './services';

/**
 * Module for database connection
 *
 * @export
 * @class DatabaseModule
 */
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
