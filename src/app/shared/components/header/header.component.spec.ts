import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isUserLoggedIn']);
    authServiceSpy.isUserLoggedIn.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),  // fornece Router, ActivatedRoute e RouterLink
        HeaderComponent                      // standalone component
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    spyOn(router, 'navigateByUrl').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve navegar para "/meu-livro" em redirectMeuLivro()', () => {
    component.redirectMeuLivro();
    expect(router.navigate).toHaveBeenCalledWith(['/meu-livro']);
  });

  it('deve navegar para "/receita/create-receita" em redirectCriarReceita()', () => {
    component.redirectCriarReceita();
    expect(router.navigate).toHaveBeenCalledWith(['/receita/create-receita']);
  });

  it('deve chamar logout e navegar para "/" em logout()', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
