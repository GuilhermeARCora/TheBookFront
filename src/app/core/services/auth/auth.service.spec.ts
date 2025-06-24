import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LoginPayload, LoginResponse, RegisterPayload, GetUserNameResponse } from './../../../shared/types/auth';
import { of } from 'rxjs';

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
    spyOn(service, 'reloadPage');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const form: RegisterPayload = { nome: 'Test', email: 'test@example.com', senha: '123456', documento:"27891333017", confirmaSenha:"123456"};

    service.register(form).subscribe();

    const req = httpMock.expectOne(`${service.apiUrl}permitted/cadastro`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should log in and set token', () => {
    const form: LoginPayload = { username: 'test@example.com', senha: '123456' };
    const mockResponse: LoginResponse = { access_token: 'mock-token' };

    spyOn(service, 'getUserName').and.returnValue(of({ nome: 'Test' }));

    service.login(form).subscribe(res => {
      expect(service.token()).toBe('mock-token');
      expect(localStorage.getItem('access_token')).toBe('mock-token');
    });

    const req = httpMock.expectOne(`${service.apiUrl}permitted/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call logout and redirect', () => {
    localStorage.setItem('access_token', 'test-token');
    service.token.set('test-token');

    service.logout();

    expect(service.token()).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should get and set user name if not already set', () => {
    const response: GetUserNameResponse = { nome: 'Alice' };

    service.getUserName().subscribe(res => {
      expect(res.nome).toBe('Alice');
      expect(service.userName()).toBe('Alice');
    });

    const req = httpMock.expectOne(`${service.apiUrl}api/usuario`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('should not fetch username again if already set', () => {
    service.userName.set('Bob');
    const obs = service.getUserName();
    obs.subscribe(res => {
      expect(res.nome).toBe('Bob');
    });
    httpMock.expectNone(`${service.apiUrl}api/usuario`);
  });
});
