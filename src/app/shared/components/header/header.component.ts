import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth/auth.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent{

  router = inject(Router);
  authService = inject(AuthService);
  isUserLoggedIn = this.authService.isUserLoggedIn();

  redirectMeuLivro(): void{
    this.router.navigate(['/meu-livro'])
  };

  redirectCriarReceita(): void{
    this.router.navigate(['/receita/create-receita'])
  };

  logout(): void{
    this.authService.logout();
    this.router.navigateByUrl('/')
  };

};
