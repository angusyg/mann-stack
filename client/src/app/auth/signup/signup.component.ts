import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../../core/core.module';
import { AppConfig } from '../../core/interfaces';
import { UserPayload } from '../../core/interfaces';
import { AuthService, NotificationService } from '../../core/services';

/**
 * Validates that password matches confirmation password
 *
 * @param {AbstractControl} formGroup from group containing password and confirmation password
 * @returns {({ [key: string]: any } | null)}
 */
function MatchPassword(formGroup: AbstractControl): { [key: string]: any } | null {
  const password = formGroup.get('password');
  const passwordConf = formGroup.get('passwordConf');
  return password && passwordConf && password.value !== passwordConf.value ? { passwordConfirmation: true } : null;
}

/**
 * User sign up component (sign up form)
 *
 * @export
 * @class SignupComponent
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  /**
   * Activates sign up invitation code use
   *
   * @type {boolean}
   * @memberof SignupComponent
   */
  public signupInvitationCode: boolean;

  /**
   * Sign up form
   *
   * @private
   * @type {FormGroup}
   * @memberof SignupComponent
   */
  public signupForm: FormGroup;

  constructor(
    @Inject(APP_CONFIG) private _config: AppConfig,
    private readonly _auth: AuthService,
    private readonly _notification: NotificationService,
    private readonly _router: Router,
  ) {
    this.signupInvitationCode = this._config.signupInvitationCode;
    this.signupForm = new FormGroup(
      {
        login: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        passwordConf: new FormControl('', [Validators.required]),
        invitationCode: new FormControl(''),
      },
      { updateOn: 'submit', validators: MatchPassword }
    );
  }

  public onSubmit() {
    if (this.signupForm.valid) {
      // Form validation OK
      this._auth.signup(this.signupForm.value).subscribe(
        (user: UserPayload) => {
          this._notification.showSuccess(`Hello ${user.login}`);
          // Redirects to home page
          this._router.navigate(['']);
        },
        (err: any) => {
          console.error(err);
          this._notification.showError('Erreur lors de l\'inscription');
        }
      );
    }
  }
}
