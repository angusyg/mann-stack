import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { CsrfToken } from '../interfaces';
import { AuthService } from '../services';

/**
 * Interceptor to handle CSRF tokens
 * Adds CSRF token to headers and if request ends in a CSRF error,
 * tries to renew token and retries request
 *
 * @export
 * @class CsrfInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  /**
   * CSRF token header name
   *
   * @private
   * @type {string}
   * @memberof CsrfInterceptor
   */
  private readonly _CSRF_HEADER: string = 'X-XSRF-TOKEN';

  /**
   * Bad CSRF token error name
   *
   * @private
   * @memberof CsrfInterceptor
   */
  private readonly _BAD_CSRF_TOKEN_ERROR: string = 'BAD_CSRF_TOKEN';

  /**
   * Http error status code for CSRF error
   *
   * @private
   * @type {number}
   * @memberof CsrfInterceptor
   */
  private readonly _CSRF_ERROR_STATUS_CODE: number = 403;

  /**
   * Authentication service
   *
   * @private
   * @type {AuthService}
   * @memberof CsrfInterceptor
   */
  private readonly _auth: AuthService;

  constructor(private readonly _token: HttpXsrfTokenExtractor, private readonly _injector: Injector) {
    this._auth = this._injector.get(AuthService);
  }

  /**
   * Intercepts request to handle CSRF token
   *
   * @param {HttpRequest<any>} req request
   * @param {HttpHandler} next request transformer
   * @returns {Observable<HttpEvent<any>>} request result as observable
   * @memberof CsrfInterceptor
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Extracts token value from cookie
      const csrfToken = this._token.getToken();
      // Be careful not to overwrite an existing header of the same name
      if (csrfToken !== null && !req.headers.has(this._CSRF_HEADER)) {
        // Adds csrf token header
        req = req.clone({ headers: req.headers.set(this._CSRF_HEADER, csrfToken) });
      }
    }
    return next.handle(req).pipe(
      catchError((err: any) => {
        // Checks error
        if (err.status === this._CSRF_ERROR_STATUS_CODE && err.error.error === this._BAD_CSRF_TOKEN_ERROR) {
          // If error, if invalid csrf token, renew token and retry request
          return this._auth.initCsrf().pipe(
            switchMap((token: CsrfToken) => next.handle(this._addCsrfToken(req, token.token))),
            catchError((erro: any) => throwError(erro.error))
          );
        } else {
          return throwError(err.error);
        }
      })
    );
  }

  /**
   * Clones request and adds CSRF token header
   *
   * @private
   * @param {*} request request to retry
   * @param {string} token CSRF token
   * @returns {HttpRequest<any>} cloned request
   * @memberof CsrfInterceptor
   */
  private _addCsrfToken(request: any, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { [this._CSRF_HEADER]: token } });
  }
}
