import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { CriarComponent } from './criar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ReceitasService } from '../../../core/services/receitas/receitas.service';
import { ToasterService } from '../../../core/services/swal/toaster.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { convertToParamMap } from '@angular/router';

describe('CriarComponent', () => {
  let fixture: ComponentFixture<CriarComponent>;
  let component: CriarComponent;
  let serviceStub: jasmine.SpyObj<ReceitasService>;
  let toasterStub: jasmine.SpyObj<ToasterService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let router: Router;
  let routeStub: Partial<ActivatedRoute>;

  beforeEach(waitForAsync(() => {

    routeStub = {
      snapshot: {
        paramMap: convertToParamMap({})
      }
    }as unknown as ActivatedRoute;

    serviceStub = jasmine.createSpyObj('ReceitasService', [
      'getReceitaById',
      'createReceita',
      'editReceita'
    ]);
    serviceStub.getReceitaById.and.returnValue(of({
      nome: 'A',
      categoria: 'B',
      descricao: 'C'
    }));
    serviceStub.createReceita.and.returnValue(of(void 0));
    serviceStub.editReceita.and.returnValue(of(void 0));

    toasterStub = jasmine.createSpyObj('ToasterService', ['success']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        CriarComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: ReceitasService, useValue: serviceStub },
        { provide: ToasterService, useValue: toasterStub },
        { provide: Location, useValue: locationSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(CriarComponent, { set: { template: '' } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture  = TestBed.createComponent(CriarComponent);
    component = fixture.componentInstance;
    router    = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('buildForm cria form com controles obrigatórios', () => {
    component.buildForm();
    const form = component.createReceitaForm!;
    expect(form.contains('nome')).toBeTrue();
    expect(form.contains('categoria')).toBeTrue();
    expect(form.contains('descricao')).toBeTrue();
    expect(form.controls['nome'].valid).toBeFalse();
    form.controls['nome'].setValue('X');
    expect(form.controls['nome'].valid).toBeTrue();
  });

  it('checkEditMode não ativa edição sem idParam', () => {
    component.buildForm();
    component.checkEditMode();
    expect(component.isEdit).toBeFalse();
    expect(component.receitaId).toBeUndefined();
    expect(component.titulo()).toBe('Cadastrar Receita');
  });

  it('checkEditMode chama enterEditMode quando há idParam', () => {
    (routeStub.snapshot as any).paramMap = convertToParamMap({ id: '7' });
    spyOn(component, 'enterEditMode');
    component.checkEditMode();
    expect(component.enterEditMode).toHaveBeenCalledWith(7);
  });

  it('enterEditMode configura edição e carrega receita', () => {
    spyOn(component, 'loadReceita');
    component.enterEditMode(5);
    expect(component.isEdit).toBeTrue();
    expect(component.receitaId).toBe(5);
    expect(component.titulo()).toBe('Editar Receita');
    expect(component.loadReceita).toHaveBeenCalledWith(5);
  });

  it('loadReceita mostra alerta no erro', () => {
    serviceStub.getReceitaById.and.returnValue(throwError(() => new Error('fail')));
    component.buildForm();
    spyOn(console, 'error');
    const swalSpy = spyOn(Swal, 'fire');
    component.loadReceita(1);
    expect(console.error).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Erro',
      text: 'Não foi possível carregar os dados da receita para edição.'
    }as any);
  });

  it('onSubmit não prossegue se form inválido', () => {
    component.buildForm();
    spyOn(component.createReceitaForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.createReceitaForm.markAllAsTouched).toHaveBeenCalled();
    expect(serviceStub.createReceita).not.toHaveBeenCalled();
  });

  it('onSubmit cria receita no modo create', () => {
    component.buildForm();
    component.createReceitaForm.setValue({ nome: 'n', categoria: 'c', descricao: 'd' });
    component.isEdit = false;
    component.onSubmit();
    expect(serviceStub.createReceita).toHaveBeenCalledWith({ nome: 'n', categoria: 'c', descricao: 'd' });
    expect(toasterStub.success).toHaveBeenCalledWith('Receita criada!');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/meu-livro');
  });

  it('onSubmit edita receita no modo edit', () => {
    component.buildForm();
    component.createReceitaForm.setValue({ nome: 'n', categoria: 'c', descricao: 'd' });
    component.isEdit = true;
    component.receitaId = 10;
    component.onSubmit();
    expect(serviceStub.editReceita).toHaveBeenCalledWith(
      { nome: 'n', categoria: 'c', descricao: 'd' },
      10
    );
    expect(toasterStub.success).toHaveBeenCalledWith('Receita editada!');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/meu-livro');
  });

  it('onSubmit mostra erro no serviço', () => {
    component.buildForm();
    component.createReceitaForm.setValue({ nome: 'n', categoria: 'c', descricao: 'd' });
    serviceStub.createReceita.and.returnValue(throwError(() => new Error('err')));
    const swalSpy = spyOn(Swal, 'fire');
    component.isEdit = false;
    component.onSubmit();
    expect(swalSpy).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Falha',
      text: 'Ocorreu um erro ao salvar a receita.'
    }as any) ;
  });

  it('goBack usa Location.back quando history.length > 1', () => {
    spyOnProperty(window.history, 'length', 'get').and.returnValue(3);
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('goBack navega para "/" quando history.length <= 1', () => {
    spyOnProperty(window.history, 'length', 'get').and.returnValue(1);
    component.goBack();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
