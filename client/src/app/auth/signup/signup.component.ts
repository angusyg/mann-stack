import { Component, Inject, OnInit } from '@angular/core';
import { APP_CONFIG } from 'src/app/core/core.module';
import { IAppConfig } from 'src/app/core/interfaces';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public signupInvitationCode: boolean;

  constructor(@Inject(APP_CONFIG) private _config: IAppConfig) {
    this.signupInvitationCode = this._config.signupInvitationCode;
  }

  public ngOnInit() {}
}
