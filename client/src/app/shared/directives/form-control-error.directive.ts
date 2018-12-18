import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Form control validation error directive
 * Adds class to form control when form control has validation errors
 *
 * @export
 * @class FormControlErrorDirective
 * @implements {OnInit}
 */
@Directive({
  selector: '[appFormControlError]',
})
export class FormControlErrorDirective implements OnInit {
  /**
   * Form control to watch
   *
   * @type {FormControl}
   * @memberof FormControlErrorDirective
   */
  @Input('appFormControlError') public formControl!: FormControl;

  constructor(private _renderer: Renderer2, private _el: ElementRef) {}

  public ngOnInit(): void {
    // Checks form control validation status
    this.formControl.statusChanges.subscribe(() => {
      if (!this.formControl.valid && (this.formControl.touched || this.formControl.dirty)) {
        // If validation has errors, adds class
        this._renderer.addClass(this._el.nativeElement, 'form-error');
      } else {
        // If no validation error, removes class
        this._renderer.removeClass(this._el.nativeElement, 'form-error');
      }
    });
  }
}
