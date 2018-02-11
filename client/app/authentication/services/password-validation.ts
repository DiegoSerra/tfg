import {AbstractControl} from '@angular/forms';

/*
    The password should meet all of the following requirements:
    - Minimum 6 characters.
    - Should contain at least 1 number.
    - Should contain at least 1 uppercase letter.
    - Should contain at least 1 lowercase letter.
*/

export class PasswordValidation {

  public static PasswordRequirements(AC: AbstractControl) {
    const password = AC.get('password').value;
    const passwordConfirm = AC.get('passwordConfirm').value;
    const numberTest = /[0-9]/;
    const upperTest = /[A-Z]/;
    const lowerTest = /[a-z]/;

    const passwordErrors = <any>{};
    const passwordConfirmErrors = <any>{};
    if (password.length === 0) {
      passwordErrors.passRequired = true;
    }
    if (password.length < 6) {
      passwordErrors.passLength = true;
    }
    if (!numberTest.test(password)) {
      passwordErrors.passNumber = true;
    }
    if (!upperTest.test(password)) {
      passwordErrors.passUpper = true;
    }
    if (!lowerTest.test(password)) {
      passwordErrors.passLower = true;
    }
    if (password !== passwordConfirm) {
      passwordConfirmErrors.matchPassword = true;
    }

    if (Object.keys(passwordErrors).length) {
      AC.get('password').setErrors(passwordErrors);
    }

    if (Object.keys(passwordConfirmErrors).length) {
      AC.get('passwordConfirm').setErrors(passwordConfirmErrors);
    }

    return null;
  }

  public static displayRequeriments(str) {
    let res = '';
    if (Object.keys(str).length) {
      res += 'La contraseña debe tener al menos';
      const requeriments = [];
      if (str.passLength) {
        requeriments.push(' 6 caracteres');
      }
      if (str.passNumber) {
        requeriments.push(' 1 número');
      }
      if (str.passUpper) {
        requeriments.push(' 1 mayúscula');
      }
      if (str.passLower) {
        requeriments.push(' 1 minúscula');   
      }
      return res + requeriments.join();
    } else {
      return res;
    }
  }
}
