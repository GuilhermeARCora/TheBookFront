import { TestBed } from '@angular/core/testing';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpEvent
} from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: HttpInterceptorFn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = (req, next) =>
      TestBed.runInInjectionContext(() => AuthInterceptor(req, next));
  });

  it('should add Authorization header when token exists and URL is not /permitted/', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue('abc123');
    const request = new HttpRequest('GET', '/api/data');

    interceptor(request, (req: HttpRequest<any>) => {
      expect(req.headers.has('Authorization')).toBeTrue();
      expect(req.headers.get('Authorization')).toBe('Bearer abc123');
      return of(new HttpResponse({ status: 200 })) as Observable<HttpEvent<any>>;
    }).subscribe(event => {
      expect(event).toBeInstanceOf(HttpResponse);
      done();
    });
  });

  it('should not add header when no token', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const request = new HttpRequest('GET', '/api/data');

    interceptor(request, (req: HttpRequest<any>) => {
      expect(req.headers.has('Authorization')).toBeFalse();
      return of(new HttpResponse({ status: 200 })) as Observable<HttpEvent<any>>;
    }).subscribe(() => done());
  });

  it('should not add header when URL contains /permitted/', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue('token');
    const request = new HttpRequest('GET', '/permitted/path');

    interceptor(request, (req: HttpRequest<any>) => {
      expect(req.headers.has('Authorization')).toBeFalse();
      return of(new HttpResponse({ status: 200 })) as Observable<HttpEvent<any>>;
    }).subscribe(() => done());
  });
});
