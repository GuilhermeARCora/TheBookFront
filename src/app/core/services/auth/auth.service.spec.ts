import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  GetUserNameResponse
} from './../../../shared/types/auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(service, 'reloadPage'); // stub apenas reloadPage
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register()', () => {
    it('deve chamar POST em permitted/cadastro', () => {
      const form: RegisterPayload = {
        nome: 'Test',
        email: 'test@example.com',
        senha: '123456',
        documento: '27891333017',
        confirmaSenha: '123456'
      };

      service.register(form).subscribe();
      const req = httpMock.expectOne(
        `${service.apiUrl}permitted/cadastro`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(form);
      req.flush(null);
    });
  });

  describe('login()', () => {
    it('deve logar, armazenar token e chamar getUserName()', () => {
      const form: LoginPayload = {
        username: 'a@b.com',
        senha: '123'
      };
      const mockRes: LoginResponse = { access_token: 'abc' };
      // spy apenas neste teste
      const getUserSpy = spyOn(service, 'getUserName')
        .and.returnValue(of({ nome: 'Teste' }));

      service.login(form).subscribe();
      const req = httpMock.expectOne(
        `${service.apiUrl}permitted/login`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockRes);

      expect(service.token()).toBe('abc');
      expect(localStorage.getItem('access_token')).toBe('abc');
      expect(getUserSpy).toHaveBeenCalled();
    });
  });

  describe('getUserName()', () => {
    it('deve buscar e setar userName se ainda não estiver em cache', () => {
      service.getUserName().subscribe(res => {
        expect(res.nome).toBe('Alice');
        expect(service.userName()).toBe('Alice');
      });
      const req = httpMock.expectOne(
        `${service.apiUrl}api/usuario`
      );
      expect(req.request.method).toBe('GET');
      req.flush({ nome: 'Alice' } as GetUserNameResponse);
    });

    it('não deve chamar HTTP se já houver userName em cache', () => {
      service.userName.set('Bob');          // prepara cache
      service.getUserName().subscribe(res => {
        expect(res.nome).toBe('Bob');       // retorna do cache
      });
      httpMock.expectNone(`${service.apiUrl}api/usuario`);
    });
  });

  describe('initFromStorage()', () => {
    beforeEach(() => {
      // stub apenas para este bloco
      spyOn(service, 'getUserName').and.returnValue(
        of({ nome: 'Teste' })
      );
    });

    it('não faz nada se já inicializado', () => {
      service.initialized.set(true);
      spyOn(localStorage, 'getItem');
      service.initFromStorage();
      expect(localStorage.getItem).not.toHaveBeenCalled();
      expect(service.getUserName).not.toHaveBeenCalled();
    });

    it('marca initialized e não chama getUserName se não houver token', () => {
      service.initialized.set(false);
      spyOn(localStorage, 'getItem').and.returnValue(null);
      service.initFromStorage();
      expect(service.initialized()).toBeTrue();
      expect(service.getUserName).not.toHaveBeenCalled();
      expect(service.token()).toBeNull();
    });

    it('marca initialized, seta token e chama getUserName se token existir', () => {
      service.initialized.set(false);
      spyOn(localStorage, 'getItem').and.returnValue('tok123');
      service.initFromStorage();
      expect(service.initialized()).toBeTrue();
      expect(service.token()).toBe('tok123');
      expect(service.getUserName).toHaveBeenCalled();
    });
  });

  describe('logout()', () => {
    it('deve limpar sessão e redirecionar', () => {
      localStorage.setItem('access_token', 'test');
      service.token.set('test');
      service.logout();
      expect(service.token()).toBeNull();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('redirectToHome()', () => {
    it('deve navegar para "/"', () => {
      service.redirectToHome();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('clearSession()', () => {
    it('deve remover token e chamar reloadPage()', () => {
      service.token.set('tok');
      service.clearSession();
      expect(service.token()).toBeNull();
      expect(service.reloadPage).toHaveBeenCalled();
    });
  });
});
