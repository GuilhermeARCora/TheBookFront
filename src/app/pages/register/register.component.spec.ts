import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let fireSpy: jasmine.Spy;
  let showLoadingSpy: jasmine.Spy;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    authServiceSpy.register.and.returnValue(of(void 0));
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RegisterComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router,      useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(RegisterComponent, { set: { template: '' } })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    showLoadingSpy = spyOn(Swal, 'showLoading');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formBuild inicializa form e validators', () => {
    const f = component.registerForm.controls;
    expect(f['nome'].validator).toBeDefined();
    expect(f['documento'].validator).toBeDefined();
    expect(f['email'].validator).toBeDefined();
    expect(f['senha'].validator).toBeDefined();
    expect(f['confirmaSenha'].validator).toBeDefined();
    expect(typeof component.registerForm.validator).toBe('function');
  });

  it('clearServerErrorOnUserInput remove serverError e limpa errorMessages', fakeAsync(() => {

    component.errorMessages = { nome: 'erro' };
    const nomeCtrl = component.registerForm.get('nome')!;
    nomeCtrl.setErrors({ serverError: 'erro' });

    nomeCtrl.setValue('novo');
    tick();

    expect(nomeCtrl.hasError('serverError')).toBeFalse();
    expect(component.errorMessages).toEqual({});
  }));

  it('clickEvent inverte hide e previne default e propagation', () => {
    const evt = {
      preventDefault: jasmine.createSpy(),
      stopPropagation: jasmine.createSpy()
    } as any as MouseEvent;

    const before = component.hide();
    component.clickEvent(evt);
    expect(component.hide()).toBe(!before);
    expect(evt.preventDefault).toHaveBeenCalled();
    expect(evt.stopPropagation).toHaveBeenCalled();
  });

  it('onSubmit sempre chama register e mostra loading', fakeAsync(() => {
    component.onSubmit();
    tick();

    expect(fireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Cadastrando...',
      allowOutsideClick: false,
      didOpen: jasmine.any(Function)
    }));

    expect(authServiceSpy.register).toHaveBeenCalled();
  }));

  it('onSubmit envia dados corretos e navega no sucesso', fakeAsync(() => {
    component.registerForm.setValue({
      nome: 'João',
      documento: '12345678909',
      email: 'a@b.com',
      senha: '123',
      confirmaSenha: '123'
    });

    component.onSubmit();
    tick();

    expect(fireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Cadastro feito com sucesso!',
      icon: 'success'
    }));
    tick();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  }));

  it('onSubmit trata erro de servidor, seta serverError e mostra alerta', fakeAsync(() => {
    component.registerForm.setValue({
      nome: 'João',
      documento: '12345678909',
      email: 'a@b.com',
      senha: '123',
      confirmaSenha: '123'
    });

    authServiceSpy.register.and.returnValue(throwError(() => ({
      error: { fieldErrors: [{ campo: 'email', mensagem: 'inválido' }] }
    })));

    component.onSubmit();
    tick();

    const emailCtrl = component.registerForm.get('email')!;
    expect(emailCtrl.hasError('serverError')).toBeTrue();
    expect(component.errorMessages['email']).toBe('inválido');

    expect(fireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Falha no cadastro!',
      icon: 'error'
    }));
  }));
});
