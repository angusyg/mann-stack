import { Route } from 'nest-router';

import { ClientModule } from './client.module';

export const routes: Route = {
  path: '',
  module: ClientModule,
};
