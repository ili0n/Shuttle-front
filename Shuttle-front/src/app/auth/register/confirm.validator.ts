import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      if(sourceCtrl === null || sourceCtrl === undefined)
      return { mismatch: true };

      if(targetCtrl === null || targetCtrl === undefined)
      return { mismatch: true };

      return sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
}