import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '../../core/services/swal/toaster.service';
import { hasFormError } from '../../shared/utils/helpers';
import { matchFieldsValidator } from '../../shared/validators/matchFields.validators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterPayload } from '../../shared/types/auth';
import { AuthService } from '../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { cpfValidator } from '../../shared/validators/cpf.validators';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  hide = signal(true);
  registerForm!: FormGroup;
  hasFormError = hasFormError;
  toast = inject(ToasterService);
  router = inject(Router);
  authService = inject(AuthService);
  errorMessages: { [key: string]: string } = {};

  ngOnInit(): void {
    this.formBuild();
    this.clearServerErrorOnUserInput();
  };

  formBuild():void{
    this.registerForm = new FormGroup ({
      nome: new FormControl('', [Validators.required]),
      documento: new FormControl('', [Validators.required, cpfValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', Validators.required),
      confirmaSenha: new FormControl('', Validators.required)
    },
    {
      validators: [matchFieldsValidator('senha', 'confirmaSenha')]
    }
  )};

  onSubmit(): void {
    const data = this.registerForm.value as RegisterPayload;

    Swal.fire({
      title: "Cadastrando...",
      text: "Aguarde um momento enquanto processamos seu cadastro.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.authService.register(data).subscribe({
      next: () => {

        Swal.fire({
          title: "Cadastro feito com sucesso!",
          text: "Para confirmar o cadastro e ativar o login, acesse a confirmação enviada em seu email!",
          icon: "success",
          showConfirmButton: true,
        }).then(() => {
          this.router.navigateByUrl('/login');
        });
      },
      error: (err) => {

        this.errorMessages = {}; // Clear previous errors

        if (err?.error?.fieldErrors) {
          err.error.fieldErrors.forEach((fieldError: any) => {
            const field = this.registerForm.get(fieldError.campo);
            if (field) {
              // Mark as touched so error displays
              field.markAsTouched();

              // Set custom error
              field.setErrors({ serverError: fieldError.mensagem });

              // Store message for mat-error
              this.errorMessages[fieldError.campo] = fieldError.mensagem;
            }
          });
        };

        Swal.fire({
          title: `Falha no cadastro!`,
          text: "Tente novamente!",
          icon: "error"
        });
      }
    });
  };

  clearServerErrorOnUserInput(): void{
    this.registerForm.valueChanges.subscribe(() => {
      for (const field in this.errorMessages) {
        const control = this.registerForm.get(field);
        if (control?.hasError('serverError')) {
          const { serverError, ...otherErrors } = control.errors || {};
          control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
        }
      }
      this.errorMessages = {};
    });
  };

  clickEvent(event: MouseEvent): void {
      this.hide.update(value => !value);
      event.preventDefault();
      event.stopPropagation();
  };

}
