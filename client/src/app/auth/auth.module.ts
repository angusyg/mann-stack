import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';

/**
 * Authentication module
 * Provides component to sign up, logout, login ...
 *
 * @export
 * @class AuthModule
 */
@NgModule({
  declarations: [SignupComponent, LogoutComponent],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
