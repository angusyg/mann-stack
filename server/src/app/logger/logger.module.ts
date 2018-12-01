import { DynamicModule, Global, Module } from '@nestjs/common';

import { loggerProviders } from './logger.providers';

@Global()
@Module({})
export class LoggerModule {
  public static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [...loggerProviders],
      exports: [...loggerProviders],
    };
  }
}
