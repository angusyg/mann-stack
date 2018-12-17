import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../../core/core.module';
import { IAppConfig } from '../../core/interfaces';
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
    @Inject(APP_CONFIG) private _config: IAppConfig,
    private readonly _authService: AuthService,
    private readonly _notificationService: NotificationService,
    private readonly router: Router,
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
      this._authService.signup(this.signupForm.value).subscribe(
        user => {
          this._notificationService.showSuccess(`Hello ${user.login}`);
          this.router.navigate(['']);
        },
        err => {
          console.error(err);
          this._notificationService.showError('Erreur lors de l\'inscitpion');
        }
      );
    }
  }
}
