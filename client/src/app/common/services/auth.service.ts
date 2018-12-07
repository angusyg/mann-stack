import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '../app-config.module';
import { AppConfig } from '../models/app-config.model';

import { LoginDto } from '../dtos/login.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private _config: AppConfig) {}

  /**
   * Logs in a user with its credentials (login/password)
   *
   * @param {any} infos qsdf
   * @returns {Observable<any>}
   * @memberof AuthService
   */
  public login(infos: LoginDto): Observable<any> {
    return this._http.post<LoginDto>(`${this._config.apiEndpoint}/login`, infos).pipe(
      map(tokens => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return tokens;
      })
    );
  }

  /**
   * Checks if user is authenticated
   * @return true if user is authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
