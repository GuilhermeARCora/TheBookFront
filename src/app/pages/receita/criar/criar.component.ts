import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToasterService } from '../../../core/services/swal/toaster.service';
import { hasFormError } from '../../../shared/utils/helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { Receita } from '../../../shared/types/receita';
import { Location } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ReceitasService } from '../../../core/services/receitas/receitas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './criar.component.html',
  styleUrl: './criar.component.scss'
})
export class CriarComponent implements OnInit {

    createReceitaForm!: FormGroup;
    toast = inject(ToasterService);
    hasFormError = hasFormError;
    location = inject(Location);
    route = inject(ActivatedRoute);
    router = inject(Router);
    receitasService = inject(ReceitasService);

    receita: Receita | null = null;
    titulo = signal('CRIE SUA RECEITA!');
    edit = signal<boolean>(false);

    ngOnInit(): void {
      this.buildForm();
      this.isEdit();
    };

    buildForm(): void{
      this.createReceitaForm = new FormGroup({
        nome: new FormControl('',[Validators.required]),
        descricao: new FormControl('',[Validators.required]),
        categoria: new FormControl('',[Validators.required])
      })
    };

    isEdit(): void{
      const idParam = this.route.snapshot.paramMap.get('id');
      if(idParam){
        this.titulo.set('EDITE SUA RECEITA!');
        this.edit.set(true);
          // this.receitaService.getById(id).subscribe(receita => {
          //   this.receita = receita;
          //   this.createReceitaForm.patchValue({
          //     titulo: receita.titulo,
          //     descricao: receita.descricao
          //   });
          // });
      }
    };

    onSubmit(): void{

      const data = this.createReceitaForm.value as Receita;

      if(this.edit()){

      }else{
        this.receitasService.createReceita(data).subscribe({
          next:()=>{
            this.router.navigate(['/meu-livro']).then(()=>{
              this.toast.success("Receita criada com sucesso!");
            })
          },
          error:()=>{
            Swal.fire({
              title: "Erro na criação da receita",
              text:"Tente novamente",
              icon:'error'
            })
          }
        })
      };

    };

    goBack(): void {
      if (window.history.length > 1) {
        this.location.back();
      } else {
        this.router.navigateByUrl('/');
      }
    };


};
