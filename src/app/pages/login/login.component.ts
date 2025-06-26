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
import { AuthService } from '../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { LoginPayload } from '../../shared/types/auth';

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
  authService = inject(AuthService);

  ngOnInit(): void {
    this.formBuild();
  }

  formBuild(): void{
    this.loginForm = new FormGroup ({
      username: new FormControl('', [Validators.required]),
      senha: new FormControl('', Validators.required)
    })
  };

  onSubmit():void{

    const data = this.loginForm.value as LoginPayload;

    if(this.loginForm.invalid) return ;

    this.authService.login(data).subscribe({
      next:() => {
        this.router.navigateByUrl('/').then(()=>{
          this.toast.success("Autenticado com sucesso!")
        });
      },
      error:() => {

        Swal.fire({
          title: "Falha no login!",
          text: "Tente novamente!",
          icon: "error"
        })
      }
    })

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
