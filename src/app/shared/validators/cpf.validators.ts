import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value?.replace(/\D/g, '');

    if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalid: true };
    }

    const calcCheckDigit = (factor: number): number => {
      let total = 0;
      for (let i = 0; i < factor - 1; i++) {
        total += parseInt(cpf[i]) * (factor - i);
      }
      const rest = (total * 10) % 11;
      return rest === 10 ? 0 : rest;
    };

    const digit1 = calcCheckDigit(10);
    const digit2 = calcCheckDigit(11);

    if (digit1 !== +cpf[9] || digit2 !== +cpf[10]) {
      return { cpfInvalid: true };
    }

    return null;
  };
}
