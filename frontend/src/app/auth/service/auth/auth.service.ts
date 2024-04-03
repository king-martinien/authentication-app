import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../../model/user.interface';
import { map, Observable } from 'rxjs';
import { LoginCredentials } from '../../model/loginCredentials.interface';
import { LoginResponse } from '../../model/loginResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http: HttpClient = inject(HttpClient);
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


  isUserLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
}
