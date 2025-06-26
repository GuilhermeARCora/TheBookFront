import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceitaComponent } from './receita.component';
import { ActivatedRoute } from '@angular/router';
import { ReceitasService } from '../../core/services/receitas/receitas.service';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('ReceitaComponent', () => {
  let fixture: ComponentFixture<ReceitaComponent>;
  let component: ReceitaComponent;
  let serviceSpy: jasmine.SpyObj<ReceitasService>;
  let routeStub: any;
  let locationSpy: jasmine.SpyObj<Location>;

  const mockReceita = {
    id: 123,
    nome: 'Test Receita',
    descricao: 'Descrição',
    ingredientes: ['ing1', 'ing2'],
    modoPreparo: 'Modo de preparo...',
  } as any;

  beforeEach(async () => {
    routeStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => '123'
        }
      }
    };

    serviceSpy = jasmine.createSpyObj('ReceitasService', ['getReceitaById']);
    serviceSpy.getReceitaById.and.returnValue(of(mockReceita));

    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [ReceitaComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ReceitasService, useValue: serviceSpy },
        { provide: Location, useValue: locationSpy }
      ]
    })
    .overrideComponent(ReceitaComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceitaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve chamar getReceitaById e atualizar o signal receita', () => {
    fixture.detectChanges();
    expect(serviceSpy.getReceitaById).toHaveBeenCalledWith(123);
    expect(component.receita()).toEqual(mockReceita);
  });

  it('ngOnInit deve definir receita como null em caso de erro', () => {
    serviceSpy.getReceitaById.and.returnValue(throwError(() => new Error('erro')));
    fixture.detectChanges();
    expect(serviceSpy.getReceitaById).toHaveBeenCalledWith(123);
    expect(component.receita()).toBeNull();
  });

  it('goBack() deve chamar location.back()', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
