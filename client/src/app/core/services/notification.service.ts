import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

/**
 * Service to show notifications
 *
 * @export
 * @class NotificationService
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _toastr: ToastrService) {}

  /**
   * Show a success notification
   *
   * @param {string} [message] message of notification
   * @param {string} [title] title of notification
   * @param {Partial<IndividualConfig>} [override] notification options
   * @memberof NotificationService
   */
  public showSuccess(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.success(message, title, override);
  }

  /**
   * Show an info notification
   *
   * @param {string} [message] message of notification
   * @param {string} [title] title of notification
   * @param {Partial<IndividualConfig>} [override] notification options
   * @memberof NotificationService
   */
  public showInfo(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.info(message, title, override);
  }

  /**
   * Show an error notification
   *
   * @param {string} [message] message of notification
   * @param {string} [title] title of notification
   * @param {Partial<IndividualConfig>} [override] notification options
   * @memberof NotificationService
   */
  public showError(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.error(message, title, override);
  }

  /**
   * Show a warning notification
   *
   * @param {string} [message] message of notification
   * @param {string} [title] title of notification
   * @param {Partial<IndividualConfig>} [override] notification options
   * @memberof NotificationService
   */
  public showWarning(message?: string, title?: string, override?: Partial<IndividualConfig>) {
    this._toastr.show(message, title, override);
  }
}
