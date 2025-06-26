import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReceitasService } from '../../core/services/receitas/receitas.service';
import { CardComponent } from "../../shared/components/card/card.component";
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth/auth.service';
import { combineLatest, map, startWith } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meu-livro',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CardComponent,
    CommonModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  templateUrl: './meu-livro.component.html',
  styleUrl: './meu-livro.component.scss'
})
export class MeuLivroComponent implements OnInit{

  receitasService = inject(ReceitasService);
  router = inject(Router);
  receitas$ = this.receitasService.receitas$;
  authService = inject(AuthService);
  userName = this.authService.userName;
  location = inject(Location);

  /** the four possible categories */
  allCategories = ['Salgado', 'Bebida', 'Sobremesa', 'Fitness'] as const;

  /** form control holding the currently‐checked categories */
  filterControl = new FormControl<(typeof this.allCategories)[number][]>(
    [],                     // valor inicial
    { nonNullable: true }   // não será null
  );

  /** a stream of only the recipes whose .categoria is in the filterControl */
  filteredReceitas$ = combineLatest([
    this.receitas$,
    this.filterControl.valueChanges.pipe(startWith(this.filterControl.value))
  ]).pipe(
    map(([receitas, selectedCats]) =>
      selectedCats.length > 0
        ? receitas.filter(r => selectedCats.includes(r.categoria as any))
        : receitas
    )
  );

  ngOnInit(): void {
    this.receitasService.loadMinhasReceitas();
  };

  editarReceita(idReceita: number): void{

    if(!idReceita) return console.warn('Esse id de receita nao existe', idReceita);

    this.router.navigate(['receita/edit-receita/', idReceita]);
  };

  irParaReceita(idReceita:number):void{

    if(!idReceita) return console.warn('Esse id de receita nao existe', idReceita);

    this.router.navigate(['receita/ver-receita/', idReceita]);
  };

  deletarReceita(idReceita:number):void{

    if(!idReceita) return console.warn('Esse id de receita nao existe', idReceita);

    Swal.fire({
      title: "Você tem certeza?",
      text: "Não será possível reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, delete!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deletado!",
          text: "Sua receita foi deletada.",
          icon: "success"
        });
      }
    });

    //subscribe aqui

  };

  redirectCriarReceita(): void{
    this.router.navigate(['/receita/create-receita'])
  };

  goBack(): void {
    this.router.navigate(['/']);
  };

};
