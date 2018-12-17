import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { UsersController } from './controllers';
import { usersProviders, UsersService } from './services';

/**
 *
 * @export
 * @class UsersModule
 */
@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...usersProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
