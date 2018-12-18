import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '../core.module';
import { AppConfig, CsrfToken, LoginInfos, UserPayload } from '../interfaces';
import { SignupInfos } from '../interfaces/signup.interface';

/**
 * Authentication service
 * Handles signup, signin, logout, CSRF security
 *
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(APP_CONFIG) private readonly _config: AppConfig, private readonly _http: HttpClient) {
    this._API_URL = this._config.serverURL + this._config.apiBase;
    this._signedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  }

  /**
   * Getter for signed in observable
   *
   * @readonly
   * @type {(Observable<boolean>)}
   * @memberof AuthService
   */
  get isSignedIn(): Observable<boolean> {
    return this._signedIn.asObservable();
  }

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
  private readonly _signedIn: BehaviorSubject<boolean>;

  /**
   * Local storage user item name
   *
   * @private
   * @type {string}
   * @memberof AuthService
   */
  private readonly _USER_ITEM: string = 'app-user';

  /**
   * Checks if user is authenticated
   *
   * @returns {boolean} true if user is authenticated
   * @memberof AuthService
   */
  public isAuthenticated(): boolean {
    // Get user infos from storage
    const user = localStorage.getItem(this._USER_ITEM);
    if (user) {
      // Checks if session is still OK (expiration only has seconds => / 1000 current date)
      return Date.now() / 1000 < JSON.parse(user).exp;
    }
    return false;
  }

  /**
   * Signs up a user
   *
   * @param {object} infos sign up infos
   * @returns {Observable<UserPayload>}
   * @memberof AuthService
   */
  public signup(infos: SignupInfos): Observable<UserPayload> {
    // Calls server
    return this._http.post<UserPayload>(`${this._API_URL}/auth/signup`, infos).pipe(
      map((response: UserPayload) => {
        this._connectUser(response);
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
  public initCsrf(): Observable<CsrfToken> {
    // Calls server to get new CSRF token
    return this._http.get<CsrfToken>(`${this._API_URL}/auth/csrf`);
  }

  /**
   * Logs in a user with its connection infos
   *
   * @param {LoginInfos} loginInfos user connection infos
   * @returns {Observable<UserPayload>} user payload
   * @memberof AuthService
   */
  public login(loginInfos: LoginInfos): Observable<UserPayload> {
    return this._http.post<UserPayload>(`${this._API_URL}/auth/login`, loginInfos).pipe(
      map((response: UserPayload) => {
        this._connectUser(response);
        return response;
      })
    );
  }

  /**
   * Logs out a user
   *
   * @returns {Observable<void>}
   * @memberof AuthService
   */
  public logout(): Observable<void> {
    return this._http.get<void>(`${this._API_URL}/auth/logout`).pipe(
      map(() => {
        localStorage.removeItem(this._USER_ITEM);
        this._signedIn.next(false);
      })
    );
  }

  /**
   * Connects a user on client side
   *
   * @private
   * @param {UserPayload} user user payload
   * @returns {void}
   * @memberof AuthService
   */
  private _connectUser(user: UserPayload): void {
    // Store logged user infos
    localStorage.setItem(this._USER_ITEM, JSON.stringify(user));
    // Update signed in status
    this._signedIn.next(true);
  }
}
