import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../../model/user.interface';
import { map, Observable } from 'rxjs';
import { LoginCredentials } from '../../model/loginCredentials.interface';
import { LoginResponse } from '../../model/loginResponse.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _router: Router = inject(Router);
  private readonly baseApiUrl = environment.baseApiUrl;

  signUp(user: Partial<User>): Observable<User> {
    return this._http.post<User>(`${this.baseApiUrl}/auth/signup`, user);
  }

  login(loginCredentials: LoginCredentials): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.baseApiUrl}/auth/signin`, loginCredentials).pipe(
      map(loginResponse => {
        localStorage.setItem('ACCESS_TOKEN', loginResponse.accessToken);
        return loginResponse;
      }),
    );
  }

  googleSignin() {
    window.location.href = `${this.baseApiUrl}/auth/google/signin`;
  }

  isUserLoggedIn() {
    const cookie = document.cookie.split(';').find(str => str.includes('accessToken'))?.split('=')[1].trim();
    console.log('cookie : ', cookie);
    if (cookie) {
      localStorage.setItem('ACCESS_TOKEN', cookie);
      document.cookie = 'accessToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }

  logOut() {
    localStorage.removeItem('ACCESS_TOKEN');
    this._router.navigate(['/auth/login']).then();
  }
}
