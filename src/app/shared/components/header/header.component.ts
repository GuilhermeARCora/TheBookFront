import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToasterService } from '../../../core/services/swal/toaster.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isUserLoggedIn = signal(true);
  router = inject(Router);
  toast = inject(ToasterService);

  redirectMeuLivro(): void{
    const id = 123;
    this.router.navigate(['/meu-livro', id])
  };

  redirectCriarReceita(): void{
    const id = 123;
    this.router.navigate(['/receita/create-receita', id])
  };

  logout(): void{

    //subscribe aqui e dentro do next
    this.router.navigateByUrl('/').then(() => {
      this.isUserLoggedIn.set(false);
      this.toast.info("Deslogado com sucesso!");
    });

  };



};
