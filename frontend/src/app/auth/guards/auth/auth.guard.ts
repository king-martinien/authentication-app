import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);

  if (_authService.isUserLoggedIn()) {
    return true;
  } else {
    _router.navigate(['/auth/login']).then(r => r);
    return false;
  }
};
