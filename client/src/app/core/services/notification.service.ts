import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _toastr: ToastrService) {}

  public showSuccess(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.success(message, title, override);
  }

  public showInfo(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.info(message, title, override);
  }

  public showError(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.error(message, title, override);
  }

  public showWarning(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.show(message, title, override);
  }
}
