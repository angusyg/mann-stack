import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Form group validation error directive
 * Adds class to form control when form validation has errors on form control
 *
 * @export
 * @class FormGroupErrorDirective
 * @implements {OnInit}
 */
@Directive({
  selector: '[appFormGroupError]',
})
export class FormGroupErrorDirective implements OnInit {
  /**
   * Form group to watch
   *
   * @type {FormGroup}
   * @memberof FormGroupErrorDirective
   */
  @Input() public group!: FormGroup;

  /**
   * Form group to watch
   *
   * @type {FormGroup}
   * @memberof FormGroupErrorDirective
   */
  @Input() public errors!: string[];

  constructor(private _renderer: Renderer2, private _el: ElementRef) {}

  public ngOnInit(): void {
    // Checks form group validation status
    this.group.statusChanges.subscribe(() => {
      if (
        this.group &&
        !this.group.valid &&
        (this.group.touched || this.group.dirty) &&
        // tslint:disable-next-line:max-line-length
        (this.group.errors !== null && Object.keys(this.group.errors).some((err: string) => this.errors.includes(err)))
      ) {
        // If validation has errors, adds class
        this._renderer.addClass(this._el.nativeElement, 'form-error');
      } else {
        // If no validation error, removes class
        this._renderer.removeClass(this._el.nativeElement, 'form-error');
      }
    });
  }
}
