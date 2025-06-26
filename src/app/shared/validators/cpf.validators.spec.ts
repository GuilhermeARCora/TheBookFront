import { FormControl } from '@angular/forms';
import { cpfValidator } from './cpf.validators';

describe('cpfValidator', () => {
  it('deve retornar null para CPF válido', () => {
    const control = new FormControl('12345678909');
    const result = cpfValidator()(control);
    expect(result).toBeNull();
  });

  it('deve retornar erro para CPF inválido', () => {
    const control = new FormControl('11111111111');
    const result = cpfValidator()(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('deve retornar null se campo estiver vazio', () => {
    const control = new FormControl('');
    const result = cpfValidator()(control);
    expect(result).toBeNull();
  });
});
