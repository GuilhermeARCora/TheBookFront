import { CardComponent } from './card.component';

describe('CardComponent (lógica de TS)', () => {
  let component: CardComponent;

  beforeEach(() => {
    component = new CardComponent();
    component.id = 42;
  });

  it('deve inicializar com nome vazio', () => {
    expect(component.nome).toBe('');
  });

  it('deve inicializar com categoria vazia', () => {
    expect(component.categoria).toBe('');
  });

  it('deve inicializar com home = true', () => {
    expect(component.home).toBeTrue();
  });

  it('inserirAcao() deve emitir this.id via acao1', () => {
    spyOn(component.acao1, 'emit');
    component.inserirAcao();
    expect(component.acao1.emit).toHaveBeenCalledWith(42);
  });

  it('outraAcao() deve emitir this.id via acao2', () => {
    spyOn(component.acao2, 'emit');
    component.outraAcao();
    expect(component.acao2.emit).toHaveBeenCalledWith(42);
  });

  it('inserirAcao2() deve emitir this.id via acao3', () => {
    spyOn(component.acao3, 'emit');
    component.inserirAcao2();
    expect(component.acao3.emit).toHaveBeenCalledWith(42);
  });
});
