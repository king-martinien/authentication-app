import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private readonly _http: HttpClient = inject(HttpClient);
  private readonly baseApiUrl = environment.baseApiUrl;

  test(): Observable<{ response: string }> {
    return this._http.get<{ response: string }>(`${this.baseApiUrl}/auth/test`);
  }
}
