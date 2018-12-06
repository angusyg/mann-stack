import * as Joi from 'joi';

import {
  AUTH_COOKIE_MAXAGE,
  AUTH_COOKIE_NAME,
  AUTH_JWT_EXPIRATION_DELAY,
  AUTH_JWT_SECRET,
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
  URL,
} from '../config.constants';

// Environment configuration schema object
export const ENV_SCHEMA: Joi.ObjectSchema = Joi.object({
  [NODE_ENV]: Joi.string()
    .valid(['development', 'production', 'test'])
    .default('development'),
  [URL]: Joi.string().default('http://localhost:3000'),
  [PORT]: Joi.number().default(3000),
  [DB_HOST]: Joi.string().default('localhost:27017'),
  [DB_NAME]: Joi.string().default('mann'),
  [LOG_LEVEL]: Joi.string()
    .valid(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
  [LOG_ENABLED]: Joi.boolean().default(true),
  [CORS_ALLOWED_ORIGINS]: Joi.array()
    .items(Joi.string())
    .default([]),
  [CORS_ALLOWED_METHODS]: Joi.array()
    .items(Joi.string().valid(['HEAD', 'GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']))
    .default(['HEAD', 'GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']),
  [CORS_ALLOWED_HEADERS]: Joi.array()
    .items(Joi.string())
    .default(['Authorization', 'Refresh', 'Content-type']),
  [CORS_EXPOSED_HEADERS]: Joi.array()
    .items(Joi.string())
    .default([]),
  [CORS_CREDENTIALS]: Joi.boolean().default(true),
  [CORS_MAX_AGE]: Joi.number().default(60 * 10),
  [CORS_PREFLIGHT_CONTINUE]: Joi.boolean().default(false),
  [CORS_OPTIONS_SUCCESSS_CODE]: Joi.number().default(204),
  [AUTH_JWT_SECRET]: Joi.string().default('JWTSecret'),
  [AUTH_JWT_EXPIRATION_DELAY]: Joi.number().default(60 * 10),
  [AUTH_COOKIE_NAME]: Joi.string().default('auth'),
  [AUTH_COOKIE_MAXAGE]: Joi.number().default(1000 * 60 * 60 * 24 * 30),
  [CSRF_COOKIE_NAME]: Joi.string().default('XSRF-TOKEN'),
  [MAIL_USER]: Joi.string(),
  [MAIL_PASSWORD]: Joi.string(),
});
