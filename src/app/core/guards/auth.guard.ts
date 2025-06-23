import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToasterService } from '../services/swal/toaster.service';
import { AuthService } from '../services/auth/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToasterService);

  if (authService.isLoggedIn()) {
    return true;
  };

  toast.error('Você não está autenticado!');
  return router.createUrlTree(['/']);
};
