import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService: AuthService = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err && (err.status === 401 || err.status === 403)) {
        if (!(err.url?.includes('signin') || err.url?.includes('signup'))) {
          _authService.logOut();
        }
      }
      throw err;
    }));
};
