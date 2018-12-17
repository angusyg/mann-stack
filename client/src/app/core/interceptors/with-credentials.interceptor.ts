import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_CONFIG } from '../core.module';
import { IAppConfig } from '../interfaces';

/**
 * Interceptor to allow navigator to add cookies on requests
 * Checks if request is for API server, if so sets withCredentials to true
 *
 * @export
 * @class WithCredentialsInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {
  /**
   * API server base URL
   *
   * @private
   * @type {string}
   * @memberof WithCredentialsInterceptor
   */
  private readonly _baseUrl: string;

  constructor(private readonly injector: Injector) {
    // Gets config
    const config = this.injector.get(APP_CONFIG) as IAppConfig;
    // Construct API server URL
    this._baseUrl = config.serverURL + config.apiBase;
  }


  /**
   * Intercepts request to add credentials if needed
   *
   * @param {HttpRequest<any>} req request
   * @param {HttpHandler} next request transformer
   * @returns {Observable<HttpEvent<any>>} request result as observable
   * @memberof CsrfInterceptor
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Checks if request if for API server (with its URL)
    if (req.url.toLowerCase().startsWith(this._baseUrl.toLowerCase())) {
      // Change credentials for request
      req = req.clone({ withCredentials: true });
    }
    return next.handle(req);
  }
}
