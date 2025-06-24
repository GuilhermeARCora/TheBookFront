import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToasterService } from '../../../core/services/swal/toaster.service';
import { AuthService } from '../../../core/services/auth/auth.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  router = inject(Router);
  toast = inject(ToasterService);
  authService = inject(AuthService);
  isUserLoggedIn = this.authService.isUserLoggedIn();

  ngOnInit(): void {

  };

  redirectMeuLivro(): void{
    const id = 123;
    this.router.navigate(['/meu-livro', id])
  };

  redirectCriarReceita(): void{
    this.router.navigate(['/receita/create-receita'])
  };

  logout(): void{
    this.authService.logout();
    this.router.navigateByUrl('/').then(() => {
      this.toast.info("Deslogado com sucesso!");
    });

  };



};
