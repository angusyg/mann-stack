import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, NotificationService } from '../../core/services';

/**
 * Logout component
 * Logs out user and redirects to login page
 *
 * @export
 * @class LogoutComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private readonly _auth: AuthService, private readonly _notification: NotificationService, private readonly _router: Router) {}

  public ngOnInit() {
    // Logs out on server
    this._auth.logout().subscribe(
      () => {
        this._notification.showSuccess('Au revoir');
        // Redirects to login page
        this._router.navigate(['/auth/login']);
      },
      (err: any) => {
        console.log(err);
        this._notification.showError('Erreur lors de la déconnexion');
      }
    );
  }
}
