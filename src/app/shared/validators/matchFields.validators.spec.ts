import { FormControl, FormGroup } from '@angular/forms';
import { matchFieldsValidator } from './matchFields.validators';

describe('matchFieldsValidator', () => {
  it('deve retornar null se os campos forem iguais', () => {
    const formGroup = new FormGroup({
      senha: new FormControl('abc123'),
      confirmarSenha: new FormControl('abc123')
    });

    const validator = matchFieldsValidator('senha', 'confirmarSenha');
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('deve adicionar erro se os campos forem diferentes', () => {
    const formGroup = new FormGroup({
      senha: new FormControl('abc123'),
      confirmarSenha: new FormControl('def456')
    });

    const validator = matchFieldsValidator('senha', 'confirmarSenha');
    const result = validator(formGroup);
    expect(result).toEqual({ matchFieldsValidator: true });

    expect(formGroup.get('confirmarSenha')?.errors).toEqual({ matchFieldsValidator: true });
  });

  it('deve funcionar mesmo com campos nulos', () => {
    const formGroup = new FormGroup({
      senha: new FormControl(null),
      confirmarSenha: new FormControl(null)
    });

    const validator = matchFieldsValidator('senha', 'confirmarSenha');
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('deve retornar null se algum dos campos não existir', () => {
    const formGroup = new FormGroup({
      apenasUmCampo: new FormControl('valor'),
    });

    const validator = matchFieldsValidator('campoQueNaoExiste', 'apenasUmCampo');
    const result = validator(formGroup);

    expect(result).toBeNull();
  });

  it('deve remover o erro quando os campos ficam iguais novamente', () => {
    const formGroup = new FormGroup({
      senha: new FormControl('abc123'),
      confirmarSenha: new FormControl('diferente')
    });

    const validator = matchFieldsValidator('senha', 'confirmarSenha');

    validator(formGroup);
    expect(formGroup.get('confirmarSenha')?.hasError('matchFieldsValidator')).toBeTrue();

    formGroup.get('confirmarSenha')?.setValue('abc123');

    const result = validator(formGroup);

    expect(result).toBeNull();
    expect(formGroup.get('confirmarSenha')?.errors).toBeNull();
  });

});
