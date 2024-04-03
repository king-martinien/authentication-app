import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    if (!req.url.includes('login') && !req.url.includes('signup')) {
      return next(req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      }));
    }
  }
  return next(req);
};
