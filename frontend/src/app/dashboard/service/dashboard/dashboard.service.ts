import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private readonly _http: HttpClient = inject(HttpClient);
  private readonly baseApiUrl = environment.baseApiUrl;

  private isNavbarOpenedSignal: WritableSignal<boolean> = signal(false);
  readonly isNavbarOpen = this.isNavbarOpenedSignal.asReadonly();


  toggleNavbar() {
    this.isNavbarOpenedSignal.update(value => !value);
  }

  test(): Observable<{ response: string }> {
    return this._http.get<{ response: string }>(`${this.baseApiUrl}/auth/test`);
  }
}
