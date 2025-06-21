import { FormGroup } from "@angular/forms";

export function hasFormError(form: FormGroup, controlName: string, errorType: string): boolean {
  const control = form.get(controlName);
  return !!(control?.hasError(errorType) && control.touched);
};

