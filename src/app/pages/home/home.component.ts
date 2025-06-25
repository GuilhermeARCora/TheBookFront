import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { AuthService } from '../../core/services/auth/auth.service';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, CommonModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{

  authService = inject(AuthService);
  isUserLoggedIn = this.authService.isUserLoggedIn();


};
