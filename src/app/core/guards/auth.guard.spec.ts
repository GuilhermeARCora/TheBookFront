import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree}
from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthGuard } from './auth.guard';
import { ToasterService } from '../services/swal/toaster.service';

describe('AuthGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let toastSpy: jasmine.SpyObj<ToasterService>;
  let fakeUrlTree: UrlTree;

  const routeSnapshot = {} as ActivatedRouteSnapshot;
  const stateSnapshot = {} as RouterStateSnapshot;

  beforeEach(() => {
    fakeUrlTree = {} as UrlTree;

    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue(fakeUrlTree);

    toastSpy = jasmine.createSpyObj('ToasterService', ['error']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: Router,         useValue: routerSpy },
        { provide: ToasterService, useValue: toastSpy }
      ]
    });
  });

  async function runGuard() {
    const result = TestBed.runInInjectionContext(() =>
      AuthGuard(routeSnapshot, stateSnapshot)
    );
    return result instanceof Promise ? await result : result;
  }

  it('deve permitir ativação se existir token em localStorage', async () => {
    spyOn(localStorage, 'getItem').and.returnValue('token-xyz');

    const result = await runGuard();
    expect(result).toBe(true);
    expect(toastSpy.error).not.toHaveBeenCalled();
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('deve exibir erro e redirecionar se não houver token', async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = await runGuard();
    expect(toastSpy.error).toHaveBeenCalledWith('Você não está autenticado!');
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/']);
    expect(result).toBe(fakeUrlTree);
  });
});
