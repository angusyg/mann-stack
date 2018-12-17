import { InjectionToken, NgModule } from '@angular/core';

import { environment } from '../../environments/environment';

import { FormErrorDirective } from './directives';
import { IAppConfig } from './interfaces';

export const APP_CONFIG = new InjectionToken<IAppConfig>('Application environment configuration');

@NgModule({
  declarations: [FormErrorDirective],
  exports: [FormErrorDirective],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        serverURL: environment.serverURL,
        apiBase: environment.apiBase,
        signupInvitationCode: environment.signupInvitationCode,
      },
    },
  ],
})
export class CoreModule {}
