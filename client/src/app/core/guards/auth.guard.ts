import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly _auth: AuthService, private readonly _router: Router) {}

  public canActivate(): boolean {
    if (!this._auth.isAuthenticated()) {
      this._router.navigate(['/auth/signup']);
      return false;
    }
    return true;
  }
}
