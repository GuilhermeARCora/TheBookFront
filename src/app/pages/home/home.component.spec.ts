import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToasterService } from '../../core/services/swal/toaster.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent (TS logic only)', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let httpMock: HttpTestingController;
  let router: Router;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let toasterMock: jasmine.SpyObj<ToasterService>;

  beforeEach(waitForAsync(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isUserLoggedIn'], {
      userName: 'TestUser'
    });
    authServiceMock.isUserLoggedIn.and.returnValue(true);

    toasterMock = jasmine.createSpyObj('ToasterService', ['info']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        HomeComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToasterService, useValue: toasterMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(HomeComponent, { set: { template: '' } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
    router    = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function initWithFlush(data: any = []): void {
    fixture.detectChanges(); // dispara ngOnInit()
    const req = httpMock.expectOne('assets/data/receita-modelo.json');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve obter isUserLoggedIn do AuthService', () => {
    initWithFlush();
    expect(component.isUserLoggedIn).toBeTrue();
    expect(authServiceMock.isUserLoggedIn).toHaveBeenCalled();
  });

  it('deve obter userName do AuthService', () => {
    initWithFlush();
    expect(component.userName).toBe('TestUser');
  });

  it('deve carregar receitaModelo no init via HttpClient', () => {
    const fakeData = [{ id: 1, nome: 'X', categoria: 'Y' } as any];
    initWithFlush(fakeData);
    expect(component.receitaModelo).toEqual(fakeData);
  });

  it('editarReceita() deve warning e não navegar quando idReceita for falsy', () => {
    initWithFlush();
    spyOn(console, 'warn');
    spyOn(router, 'navigate');

    component.editarReceita(0);

    expect(console.warn).toHaveBeenCalledWith(
      'Esse id de receita nao existe', 0
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('editarReceita() deve navegar para "/receita/edit-receita/:id" quando idReceita for válido', () => {
    initWithFlush();
    spyOn(router, 'navigate');

    component.editarReceita(123);

    expect(router.navigate).toHaveBeenCalledWith([
      'receita/edit-receita/', 123
    ]);
  });

  it('irParaReceita() deve chamar toaster.info com a mensagem padrão', () => {
    initWithFlush();
    component.irParaReceita(123);
    expect(toasterMock.info).toHaveBeenCalledWith(
      'Apenas ilustrativas.<br> Cadastre as suas!'
    );
  });

  it('redirectCriarReceita() deve navegar para "/receita/create-receita"', () => {
    initWithFlush();
    spyOn(router, 'navigate');
    component.redirectCriarReceita();
    expect(router.navigate).toHaveBeenCalledWith(['/receita/create-receita']);
  });

  it('redirectMeuLivro() deve navegar para "/meu-livro"', () => {
    initWithFlush();
    spyOn(router, 'navigate');
    component.redirectMeuLivro();
    expect(router.navigate).toHaveBeenCalledWith(['/meu-livro']);
  });
});
