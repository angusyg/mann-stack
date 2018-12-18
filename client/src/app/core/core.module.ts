import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { environment } from '../../environments/environment';

import { AppConfig } from './interfaces';

export const APP_CONFIG = new InjectionToken<AppConfig>('Application environment configuration');

/**
 * Core module
 * Provides providers
 *
 * @export
 * @class CoreModule
 */
@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, NgbModule, ToastrModule.forRoot()],
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
  exports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, NgbModule],
})
export class CoreModule {}
