import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CsrfInterceptor } from './csrf.interceptor';
import { WithCredentialsInterceptor } from './with-credentials.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: WithCredentialsInterceptor,
    multi: true,
  },
];
