import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFormError]',
})
export class FormErrorDirective implements OnInit {
  @Input('appFormError') public formControl!: any[];

  constructor(private _renderer: Renderer2, private _el: ElementRef) {}

  public ngOnInit(): void {
    this.formControl.forEach(formControl =>
      formControl.statusChanges.subscribe(() => {
        if (!formControl.valid && (formControl.touched || formControl.dirty)) {
          this._renderer.addClass(this._el.nativeElement, 'form-error');
        } else {
          this._renderer.removeClass(this._el.nativeElement, 'form-error');
        }
      })
    );
  }
}
