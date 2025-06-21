import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuLivroComponent } from './meu-livro.component';

describe('MeuLivroComponent', () => {
  let component: MeuLivroComponent;
  let fixture: ComponentFixture<MeuLivroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeuLivroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeuLivroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
