import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormService {

  public static onFormValuesChanged(form: FormGroup, formErrors: any) {
    for (const field in formErrors) {
      if (!formErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      formErrors[field] = {};

      // Get the control
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        formErrors[field] = control.errors;
      }
    }
  }

  constructor() { }

}
