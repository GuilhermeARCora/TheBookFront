import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldsValidator(field1: string, field2: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const control1 = form.get(field1);
    const control2 = form.get(field2);

    if (!control1 || !control2) return null;

    const value1 = control1.value;
    const value2 = control2.value;

    if (value1 !== value2) {
      control2.setErrors({ ...control2.errors, matchFieldsValidator: true });
      return { matchFieldsValidator: true }; 
    }

    // Clear only the match error if it was previously set
    if (control2.hasError('matchFieldsValidator')) {
      const updatedErrors = { ...control2.errors };
      delete updatedErrors['matchFieldsValidator'];
      control2.setErrors(Object.keys(updatedErrors).length ? updatedErrors : null);
    }

    return null;
  };
}
