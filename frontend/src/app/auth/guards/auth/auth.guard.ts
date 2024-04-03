import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (_authService.isUserLoggedIn()) {
      return true;
    } else {
      _router.navigate(['/auth/login']).then(r => r);
      return false;
    }
  }
  return false;

};
