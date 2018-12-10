import { InjectionToken, NgModule } from '@angular/core';

import { environment } from '../../environments/environment';

import { IAppConfig } from './interfaces';

export const APP_CONFIG = new InjectionToken<IAppConfig>('Application environment configuration');

@NgModule({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        apiURL: environment.apiURL,
        signupInvitationCode: environment.signupInvitationCode,
      },
    },
  ],
})
export class CoreModule {}
