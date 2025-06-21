import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriarReceitaComponent } from './editar-criar-receita.component';

describe('EditarCriarReceitaComponent', () => {
  let component: EditarCriarReceitaComponent;
  let fixture: ComponentFixture<EditarCriarReceitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCriarReceitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCriarReceitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
