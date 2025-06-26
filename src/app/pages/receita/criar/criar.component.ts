import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../core/services/swal/toaster.service';
import { hasFormError } from '../../../shared/utils/helpers';
import { ReceitasService } from '../../../core/services/receitas/receitas.service';
import { Receita } from '../../../shared/types/receita';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit {

  toast = inject(ToasterService);
  hasFormError = hasFormError;
  createReceitaForm!: FormGroup;
  isEdit = false;
  receitaId?: number;
  titulo = signal<string>('Cadastrar Receita');
  location = inject(Location);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  service = inject(ReceitasService);
  router = inject(Router);

  ngOnInit(): void {
    this.buildForm();
    this.checkEditMode();
  }

  buildForm(): void {
    this.createReceitaForm = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.enterEditMode(+idParam);
    }
  }

  enterEditMode(id: number): void {
    this.isEdit = true;
    this.receitaId = id;
    this.titulo.set('Editar Receita');
    this.loadReceita(id);
  }

  loadReceita(id: number): void {
    this.service.getReceitaById(id)
      .subscribe({
        next: (receita: any) => {
          // aqui fazemos o patchValue de forma explícita
          this.createReceitaForm.patchValue({
            nome: receita.titulo,
            categoria: receita.categoria,
            descricao: receita.receita
          });
        },
        error: err => {
          console.error('Erro ao carregar receita:', err);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível carregar os dados da receita para edição.'
          });
        }
      });
  }

  onSubmit(): void {
    if (this.createReceitaForm.invalid) {
      this.createReceitaForm.markAllAsTouched();
      return;
    }

    const payload: Receita = this.createReceitaForm.value;
    const request$ = this.isEdit
      ? this.service.editReceita(payload, this.receitaId!)
      : this.service.createReceita(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Receita editada!' : 'Receita criada!');
        this.router.navigateByUrl('/meu-livro');
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Falha',
          text: 'Ocorreu um erro ao salvar a receita.'
        });
      }
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');  // rota padrão
    }
  }
}
