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

  ngOnInit(): void {
    this.formBuild();
  };

  formBuild():void{
    this.registerForm = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', Validators.required),
      confirmeEmail: new FormControl('', [Validators.required, Validators.email]),
      confirmeSenha: new FormControl('', Validators.required)
    },
    {
      validators: [
              matchFieldsValidator('email', 'confirmeEmail'),
              matchFieldsValidator('senha', 'confirmeSenha')
              ]
    }
  )};

  onSubmit():void{

  };

  clickEvent(event: MouseEvent): void {
      this.hide.update(value => !value);
      event.preventDefault();
      event.stopPropagation();
  };

}
