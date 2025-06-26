import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MeuLivroComponent } from './meu-livro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of, skip } from 'rxjs';
import Swal from 'sweetalert2';
import { ReceitasService } from '../../core/services/receitas/receitas.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MeuLivroComponent', () => {
  let fixture: ComponentFixture<MeuLivroComponent>;
  let router: Router;
  let receitasServiceStub: {
    receitas$: BehaviorSubject<any[]>;
    loadMinhasReceitas: jasmine.Spy;
    deleteReceita: jasmine.Spy;
  };

  const authServiceStub = { userName: 'UsuarioTeste' };

  beforeEach(waitForAsync(() => {
    receitasServiceStub = {
      receitas$: new BehaviorSubject([
        { id: 1, categoria: 'Salgado' },
        { id: 2, categoria: 'Bebida' },
        { id: 3, categoria: 'Salgado' }
      ]),
      loadMinhasReceitas: jasmine.createSpy('loadMinhasReceitas'),
      deleteReceita: jasmine.createSpy('deleteReceita').and.returnValue(of(void 0))
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        MeuLivroComponent
      ],
      providers: [
        { provide: ReceitasService, useValue: receitasServiceStub },
        { provide: AuthService,    useValue: authServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })

    .overrideComponent(MeuLivroComponent, {
      set: { template: '' }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeuLivroComponent);
    router  = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('chama loadMinhasReceitas no init', () => {
    expect(receitasServiceStub.loadMinhasReceitas).toHaveBeenCalled();
  });

  it('userName vindo do AuthService', () => {
    expect(fixture.componentInstance.userName).toBe('UsuarioTeste');
  });

  it('filteredReceitas$ emite todas sem filtro', (done) => {
    fixture.componentInstance.filteredReceitas$.subscribe(list => {
      expect(list.length).toBe(3);
      done();
    });
  });

  it('filteredReceitas$ filtra por categoria Salgado', (done) => {
    fixture.componentInstance.filteredReceitas$
      .pipe(skip(1))
      .subscribe(list => {
        expect(list.every(r => r.categoria === 'Salgado')).toBeTrue();
        done();
      });

    fixture.componentInstance.filterControl.setValue(['Salgado']);
  });

  it('editarReceita não navega e faz warn se id falsy', () => {
    spyOn(console, 'warn');
    fixture.componentInstance.editarReceita(0);
    expect(console.warn).toHaveBeenCalledWith('Esse id de receita nao existe', 0);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('editarReceita navega para edição se id válido', () => {
    fixture.componentInstance.editarReceita(42);
    expect(router.navigate).toHaveBeenCalledWith(['receita/edit-receita/', 42]);
  });

  it('irParaReceita não navega e faz warn se id falsy', () => {
    spyOn(console, 'warn');
    fixture.componentInstance.irParaReceita(undefined as any);
    expect(console.warn).toHaveBeenCalledWith('Esse id de receita nao existe', undefined);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('irParaReceita navega para visualização se id válido', () => {
    fixture.componentInstance.irParaReceita(7);
    expect(router.navigate).toHaveBeenCalledWith(['receita/ver-receita/', 7]);
  });

  it('deletarReceita não chama Swal se id falsy', () => {
    spyOn(console, 'warn');
    const sw = spyOn(Swal, 'fire');
    fixture.componentInstance.deletarReceita(0);
    expect(console.warn).toHaveBeenCalledWith('Esse id de receita nao existe', 0);
    expect(sw).not.toHaveBeenCalled();
  });

  it('deletarReceita chama Swal.fire com confirmação para id válido', () => {
    const sw = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
    fixture.componentInstance.deletarReceita(99);
    expect(sw).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Você tem certeza?',
      text: 'Não será possível reverter isso!',
      icon: 'warning'
    }));
  });

  it('redirectCriarReceita navega para criar receita', () => {
    fixture.componentInstance.redirectCriarReceita();
    expect(router.navigate).toHaveBeenCalledWith(['/receita/create-receita']);
  });

  it('goBack navega para "/"', () => {
    fixture.componentInstance.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
