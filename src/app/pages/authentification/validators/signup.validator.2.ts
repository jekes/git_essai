import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

export class PasswordValidator {

  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  static areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;

    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (val === undefined) {
          val = control.value;
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }
    if (valid) { return (null); }
    return ({ areEqual: true });
  }





  static passwordConfirming(c: AbstractControl) {
    if (!c.parent || !c) { return (null); }
    const pwd = c.parent.get('password');
    const cpwd = c.parent.get('repeat_password');
    if (!pwd || !cpwd) { return (null); }
    if (pwd.value !== cpwd.value) {
      return ({ areEqual: true });

    }
    return (null);
  }

}
export class UsernameValidator {
  static validUsername(fc: FormControl) {
    if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
      return ({ validUsername: true });
    } else {
      return (null);
    }
  }
}
