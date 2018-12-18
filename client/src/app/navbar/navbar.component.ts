import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserPayload } from '../core/interfaces';
import { NotificationService } from '../core/services';
import { AuthService } from '../core/services/auth.service';

/**
 * Navbar link data
 *
 * @interface NavbarLink
 */
interface NavbarLink {
  /**
   * Link title
   *
   * @type {string}
   * @memberof NavbarLink
   */
  title: string;

  /**
   * Router link
   *
   * @type {string}
   * @memberof NavbarLink
   */
  routerLink: string;
}

/**
 * Navbar component
 *
 * @export
 * @class NavbarComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  /**
   * Navbar links for connected user
   *
   * @private
   * @type {NavbarLink[]}
   * @memberof NavbarComponent
   */
  private readonly _logged: NavbarLink[] = [
    {
      title: 'Pronostiques',
      routerLink: 'bets',
    },
    {
      title: 'Classement',
      routerLink: 'ranking',
    },
    {
      title: 'Bonus',
      routerLink: 'bonus',
    },
  ];

  /**
   * Navbar current links
   *
   * @type {NavbarLink[]}
   * @memberof NavbarComponent
   */
  public links!: NavbarLink[];

  /**
   * Login form
   *
   * @type {FormGroup}
   * @memberof NavbarComponent
   */
  public loginForm: FormGroup;

  /**
   * Flag for user connection status
   *
   * @type {boolean}
   * @memberof NavbarComponent
   */
  public signedIn!: boolean;

  constructor(private readonly _auth: AuthService, private readonly _notification: NotificationService, private readonly _router: Router) {
    this.loginForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  public ngOnInit() {
    this._auth.isSignedIn.subscribe((status: boolean | null) => {
      this.signedIn = status !== null && status === true;
      this._updateLinks();
    });
  }

  /**
   * Logs in a user with its login and password
   *
   * @memberof NavbarComponent
   */
  public login(): void {
    if (this.loginForm.valid) {
      // If login form is valid, calls server
      this._auth.login(this.loginForm.value).subscribe(
        (user: UserPayload) => {
          this._notification.showSuccess(`Hello ${user.login}`);
          // Redirects to home page
          this._router.navigate(['']);
        },
        (err: any) => {
          console.log(err);
          this._notification.showError('Erreur lors de la connexion');
        }
      );
    }
  }

  /**
   * Updates navbar link depending on user connection status
   *
   * @private
   * @param {(boolean | null)} status user connection status
   * @memberof NavbarComponent
   */
  private _updateLinks(): void {
    this.links = this.signedIn === true ? this._logged : [];
  }
}
