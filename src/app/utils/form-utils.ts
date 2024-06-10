import {AbstractControl} from "@angular/forms";

export function getFormControlErrors(control: AbstractControl): string {
  if (!control.errors) {
    return '';
  }

  const errorKeys = Object.keys(control.errors);
  if (errorKeys.length > 0) {
    return `formErrors.${errorKeys[0]}`;
  }

  return '';
}
