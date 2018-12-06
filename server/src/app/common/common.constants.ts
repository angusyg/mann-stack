import { join } from 'path';

// Database connection token name
export const DB_CONNECTION_TOKEN = 'DbConnectionToken';

// Logger service token name
export const LOGGER_TOKEN = 'LoggerToken';

// User model token name
export const USER_MODEL_TOKEN = 'UserModelToken';

// Path to folder with env configurations
export const ENV_FOLDER = join(__dirname, '../../environments/');

export const NODE_ENV: string = 'NODE_ENV';
export const URL: string = 'URL';
export const PORT: string = 'PORT';
export const DB_HOST: string = 'DB_HOST';
export const DB_NAME: string = 'DB_NAME';
export const LOG_LEVEL: string = 'LOG_LEVEL';
export const LOG_ENABLED: string = 'LOG_ENABLED';
export const CORS_ALLOWED_ORIGINS: string = 'CORS_ALLOWED_ORIGINS';
export const CORS_ALLOWED_METHODS: string = 'CORS_ALLOWED_METHODS';
export const CORS_ALLOWED_HEADERS: string = 'CORS_ALLOWED_HEADERS';
export const CORS_EXPOSED_HEADERS: string = 'CORS_EXPOSED_HEADERS';
export const CORS_CREDENTIALS: string = 'CORS_CREDENTIALS';
export const CORS_MAX_AGE: string = 'CORS_MAX_AGE';
export const CORS_PREFLIGHT_CONTINUE: string = 'CORS_PREFLIGHT_CONTINUE';
export const CORS_OPTIONS_SUCCESSS_CODE: string = 'CORS_OPTIONS_SUCCESSS_CODE';
export const AUTH_JWT_SECRET: string = 'AUTH_JWT_SECRET';
export const AUTH_JWT_EXPIRATION_DELAY: string = 'AUTH_JWT_EXPIRATION_DELAY';
export const AUTH_COOKIE_NAME = 'AUTH_COOKIE_NAME';
export const AUTH_COOKIE_MAXAGE: string = 'AUTH_COOKIE_MAXAGE';
export const CSRF_COOKIE_NAME: string = 'CSRF_COOKIE_NAME';
export const MAIL_USER: string = 'MAIL_USER';
export const MAIL_PASSWORD: string = 'MAIL_PASSWORD';
