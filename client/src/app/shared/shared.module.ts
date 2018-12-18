import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormControlErrorDirective, FormGroupErrorDirective } from './directives';

/**
 * Core module
 * Provides shared directives, providers ...
 *
 * @export
 * @class CoreModule
 */
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [FormGroupErrorDirective, FormControlErrorDirective],
  exports: [CommonModule, ReactiveFormsModule, FormsModule , FormGroupErrorDirective, FormControlErrorDirective],
})
export class SharedModule {}
