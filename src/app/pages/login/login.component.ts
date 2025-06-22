import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { hasFormError } from '../../shared/utils/helpers';
import { ToasterService } from '../../core/services/swal/toaster.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  hide = signal(true);
  loginForm!: FormGroup;
  hasFormError = hasFormError;
  toast = inject(ToasterService);
  router = inject(Router);

  ngOnInit(): void {
    this.formBuild();
  }

  formBuild(): void{
    this.loginForm = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', Validators.required)
    })
  };

  onSubmit():void{

  };

  clickEvent(event: MouseEvent): void {
      this.hide.update(value => !value);
      event.preventDefault();
      event.stopPropagation();
  };

  redirectToInicio(): void{
    this.router.navigateByUrl('/');
  };

}
