import { Route } from 'nest-router';

import { ApiModule } from './api.module';
import { AuthModule, UsersModule } from './modules';

export const routes: Route = {
  path: '/api',
  module: ApiModule,
  children: [{ path: '/auth', module: AuthModule }, { path: '/users', module: UsersModule }],
};
