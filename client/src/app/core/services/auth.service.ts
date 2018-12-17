import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '../core.module';
import { IAppConfig, IUserPayload } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * API Server URL
   *
   * @private
   * @type {string}
   * @memberof AuthService
   */
  private readonly _API_URL: string;

  /**
   * User connection status
   *
   * @private
   * @memberof AuthService
   */
  private readonly _signedIn = new BehaviorSubject<boolean | null>(null);

  constructor(@Inject(APP_CONFIG) private readonly _config: IAppConfig, private readonly _http: HttpClient) {
    this._API_URL = this._config.serverURL + this._config.apiBase;
  }

  get isSignedIn(): Observable<boolean | null> {
    return this._signedIn.asObservable();
  }

  public isAuthenticated(): boolean {
    return false;
  }

  /**
   * Signs up a user
   *
   * @param {object} infos sign up infos
   * @returns {Observable<IUserPayload>}
   * @memberof AuthService
   */
  public signup(infos: object): Observable<IUserPayload> {
    return this._http.post<any>(`${this._API_URL}/auth/signup`, infos).pipe(
      map((response: IUserPayload) => {
        localStorage.setItem('user', JSON.stringify(response));
        this._signedIn.next(true);
        return response;
      })
    );
  }

  /**
   * Gets CSRF cookie and token value
   *
   * @returns {Observable<void>}
   * @memberof AuthService
   */
  public initCsrf(): Observable<string> {
    return this._http.get<any>(`${this._API_URL}/auth/csrf`);
  }
}
