import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { AuthService } from '../../core/services/auth/auth.service';
import { CardComponent } from "../../shared/components/card/card.component";
import { ReceitaCard } from '../../shared/types/receita';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '../../core/services/swal/toaster.service';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, CommonModule, CardComponent, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);
  isUserLoggedIn = this.authService.isUserLoggedIn();
  userName = this.authService.userName;
  toast = inject(ToasterService);

  receitaModelo: ReceitaCard[] = [];
  http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<ReceitaCard[]>('assets/data/receita-modelo.json')
      .subscribe((data) => {
        this.receitaModelo = data;
      });
  };

  editarReceita(idReceita: number): void{

    if(!idReceita) return console.warn('Esse id de receita nao existe', idReceita);

    this.router.navigate(['receita/edit-receita/', idReceita]);
  };

  irParaReceita(idReceita:number):void{

    this.toast.info("Apenas ilustrativas.<br> Cadastre as suas!")

  };

  redirectCriarReceita(): void{
    this.router.navigate(['/receita/create-receita'])
  };

  redirectMeuLivro(): void{
    this.router.navigate(['/meu-livro'])
  };

};
