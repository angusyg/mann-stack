import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { httpInterceptorProviders } from './core/interceptors';
import { NavbarModule } from './navbar/navbar.module';

/**
 * Application root module
 *
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, CoreModule, NavbarModule],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
