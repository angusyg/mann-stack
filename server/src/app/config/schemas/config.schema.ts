import { array, boolean, number, object, ObjectSchema, string } from 'joi';

import {
  AUTH_COOKIE_MAXAGE,
  AUTH_COOKIE_NAME,
  AUTH_JWT_EXPIRATION_DELAY,
  AUTH_JWT_SECRET,
  AUTH_MAIL_CONFIRMATION,
  CORS_ALLOWED_HEADERS,
  CORS_ALLOWED_METHODS,
  CORS_ALLOWED_ORIGINS,
  CORS_CREDENTIALS,
  CORS_EXPOSED_HEADERS,
  CORS_MAX_AGE,
  CORS_OPTIONS_SUCCESSS_CODE,
  CORS_PREFLIGHT_CONTINUE,
  CSRF_COOKIE_NAME,
  DB_HOST,
  DB_NAME,
  LOG_ENABLED,
  LOG_LEVEL,
  MAIL_PASSWORD,
  MAIL_USER,
  NODE_ENV,
  PORT,
  STATIC_PREFIX,
  STATIC_SERVE,
  URL,
} from '../../common/constants';

// Environment configuration schema object
export const ENV_SCHEMA: ObjectSchema = object({
  [NODE_ENV]: string()
    .valid(['development', 'production', 'test'])
    .default('development'),
  [URL]: string().default('http://localhost:3000'),
  [PORT]: number().default(3000),
  [DB_HOST]: string().default('localhost:27017'),
  [DB_NAME]: string().default('mann'),
  [LOG_LEVEL]: string()
    .valid(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
  [LOG_ENABLED]: boolean().default(true),
  [CORS_ALLOWED_ORIGINS]: array()
    .items(string())
    .default([]),
  [CORS_ALLOWED_METHODS]: array()
    .items(string().valid(['HEAD', 'GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']))
    .default(['HEAD', 'GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']),
  [CORS_ALLOWED_HEADERS]: array()
    .items(string())
    .default(['Authorization', 'Refresh', 'Content-type']),
  [CORS_EXPOSED_HEADERS]: array()
    .items(string())
    .default([]),
  [CORS_CREDENTIALS]: boolean().default(true),
  [CORS_MAX_AGE]: number().default(60 * 10),
  [CORS_PREFLIGHT_CONTINUE]: boolean().default(false),
  [CORS_OPTIONS_SUCCESSS_CODE]: number().default(204),
  [AUTH_JWT_SECRET]: string().default('JWTSecret'),
  [AUTH_JWT_EXPIRATION_DELAY]: number().default(60 * 10),
  [AUTH_COOKIE_NAME]: string().default('auth'),
  [AUTH_COOKIE_MAXAGE]: number().default(1000 * 60 * 60 * 24 * 30),
  [AUTH_MAIL_CONFIRMATION]: boolean().default(false),
  [CSRF_COOKIE_NAME]: string().default('XSRF-TOKEN'),
  [MAIL_USER]: string(),
  [MAIL_PASSWORD]: string(),
  [STATIC_SERVE]: boolean().default(false),
  [STATIC_PREFIX]: string().default('/public/'),
});
