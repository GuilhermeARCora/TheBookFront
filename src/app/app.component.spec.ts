import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from './core/services/auth/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let events$: Subject<NavigationEnd>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerStub: Partial<Router>;

  beforeEach(async () => {

    events$ = new Subject<NavigationEnd>();


    authServiceSpy = jasmine.createSpyObj('AuthService', ['initFromStorage']);


    routerStub = {
      events: events$.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent
      ],
      providers: [
        { provide: Router,       useValue: routerStub },
        { provide: AuthService,  useValue: authServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(AppComponent, { set: { template: '' } })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit chama initFromStorage()', () => {
    expect(authServiceSpy.initFromStorage).toHaveBeenCalled();
  });

  it('inicialmente hideHeader e hideFooter são true', () => {
    expect(component.hideHeader()).toBeTrue();
    expect(component.hideFooter()).toBeTrue();
  });

  it('ao navegar para /home mostra header e footer', fakeAsync(() => {
    events$.next(new NavigationEnd(1, '/home', '/home'));
    tick();
    expect(component.hideHeader()).toBeFalse();
    expect(component.hideFooter()).toBeFalse();
  }));

  it('ao navegar para /login esconde header apenas', fakeAsync(() => {
    events$.next(new NavigationEnd(1, '/login', '/login'));
    tick();
    expect(component.hideHeader()).toBeTrue();
    expect(component.hideFooter()).toBeFalse();
  }));

  it('ao navegar para /404 esconde header e footer', fakeAsync(() => {
    events$.next(new NavigationEnd(1, '/404', '/404'));
    tick();
    expect(component.hideHeader()).toBeTrue();
    expect(component.hideFooter()).toBeTrue();
  }));
});
