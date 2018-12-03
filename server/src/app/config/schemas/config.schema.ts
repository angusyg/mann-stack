import * as Joi from 'joi';

import {
  CORS_ALLOWED_HEADERS,
  CORS_ALLOWED_METHODS,
  CORS_ALLOWED_ORIGINS,
  CORS_CREDENTIALS,
  CORS_EXPOSED_HEADERS,
  CORS_MAX_AGE,
  CORS_OPTIONS_SUCCESSS_CODE,
  CORS_PREFLIGHT_CONTINUE,
  DB_HOST,
  DB_NAME,
  JWT_EXPIRATION_DELAY,
  JWT_SECRET,
  LOG_ENABLED,
  LOG_LEVEL,
  NODE_ENV,
  PORT,
} from '../config.constants';

// Environment configuration schema object
export const ENV_SCHEMA: Joi.ObjectSchema = Joi.object({
  [NODE_ENV]: Joi.string()
    .valid(['development', 'production', 'test'])
    .default('development'),
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
  [JWT_SECRET]: Joi.string().default('JWTSecret'),
  [JWT_EXPIRATION_DELAY]: Joi.number().default(60 * 10),
});
