import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ReceitasService } from './receitas.service';
import { BehaviorSubject } from 'rxjs';

fdescribe('ReceitasService', () => {
  let service: ReceitasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReceitasService]
    });
    service = TestBed.inject(ReceitasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createReceita should POST to api/receita', () => {
    const payload = { id: 1, nome: 'X', categoria: 'Y' } as any;
    service.createReceita(payload).subscribe();

    const req = httpMock.expectOne(`${service.apiUrl}api/receita`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });

  it('editReceita should PATCH to api/receita/:id', () => {
    const payload = { id: 2, nome: 'A', categoria: 'B' } as any;
    service.editReceita(payload, 42).subscribe();

    const req = httpMock.expectOne(`${service.apiUrl}api/receita/42`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });

  it('getReceitaById should GET api/receita/:id and return Receita', () => {
    const mock = { id: 3, nome: 'Nome', categoria: 'Cat' } as any;
    let result: any;
    service.getReceitaById(3).subscribe(res => (result = res));

    const req = httpMock.expectOne(`${service.apiUrl}api/receita/3`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(result).toEqual(mock);
  });

  describe('loadMinhasReceitas()', () => {
    it('should load receitas and update receitas$', () => {
      const subj = (service as any).receitasSubject as BehaviorSubject<any[]>;
      // initial value
      expect(subj.value).toEqual([]);

      service.loadMinhasReceitas();

      const req = httpMock.expectOne(
        `${service.apiUrl}api/receita/minhasReceitas`
      );
      expect(req.request.method).toBe('GET');
      // respond with payload
      req.flush({ receitas: [{ id: 1 }, { id: 2 }] });

      // BehaviorSubject updated
      expect(subj.value).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should log error on HTTP failure', () => {
      spyOn(console, 'error');
      service.loadMinhasReceitas();

      const req = httpMock.expectOne(
        `${service.apiUrl}api/receita/minhasReceitas`
      );
      req.flush('error', { status: 500, statusText: 'Server Error' });

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao carregar receitas',
        jasmine.anything()
      );
    });
  });

  it('deleteReceita should DELETE api/receita/:id and remove from receitas$', (done) => {
    const subj = (service as any).receitasSubject as BehaviorSubject<any[]>;
    // seed with three items
    subj.next([{ id: 1 }, { id: 2 }, { id: 3 }]);

    service.deleteReceita(2).subscribe(() => {
      // after deletion, only id 1 and 3 remain
      expect(subj.value).toEqual([{ id: 1 }, { id: 3 }]);
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}api/receita/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
