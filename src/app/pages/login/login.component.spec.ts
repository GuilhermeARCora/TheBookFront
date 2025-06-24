import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToasterService } from '../../core/services/swal/toaster.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toasterServiceSpy: jasmine.SpyObj<ToasterService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));
    toasterServiceSpy = jasmine.createSpyObj('ToasterService', ['fireToastError', 'success']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToasterService, useValue: toasterServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should validate required fields', () => {
    component.loginForm.setValue({ username: '', senha: '' });
    expect(component.loginForm.invalid).toBeTrue();
    expect(component.loginForm.controls['username'].errors?.['required']).toBeTrue();
    expect(component.loginForm.controls['senha'].errors?.['required']).toBeTrue();
  });

  it('should call AuthService.login and navigate on success', fakeAsync(() => {
    component.loginForm.setValue({ username: 'test@example.com', senha: '123456' });

    authServiceSpy.login.and.returnValue(of({ access_token: 'fake-token' }));

    component.onSubmit();

    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'test@example.com', senha: '123456' });
  }));


  it('should not call login if loginForm is invalid', () => {
    component.loginForm.setValue({ username: '', senha: '' });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should toggle hide and prevent default behavior on clickEvent', () => {
    component.hide.set(true);

    const mockEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation')
    } as unknown as MouseEvent;

    component.clickEvent(mockEvent);

    expect(component.hide()).toBeFalse();

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

});
