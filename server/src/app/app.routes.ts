import { Routes } from 'nest-router';

import { routes as apiRoutes } from './api/api.routes';
import { routes as clientRoutes } from './client/client.routes';

export const routes: Routes = [clientRoutes,apiRoutes];
