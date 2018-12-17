import { parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { validate } from 'joi';
import { join } from 'path';

import { ENV_FOLDER } from '../../common/constants';
import { ENV_SCHEMA } from '../schemas';

/**
 * Environment configuration map
 *
 * @interface EnvConfig
 */
interface EnvConfig {
  [key: string]: any;
}

/**
 * Configuration service
 * Holds configuration values loaded from environment
 *
 * @export
 * @class ConfigService
 */
export class ConfigService {
  /**
   * Configuration values map
   *
   * @private
   * @type {EnvConfig}
   * @memberof ConfigService
   */
  private readonly _envConfig: EnvConfig;

  constructor() {
    const envFile = join(ENV_FOLDER, `${process.env.NODE_ENV}.env`);
    let config = {};
    if (existsSync(envFile)) {
      // Load of environment configuration
      config = parse(readFileSync(envFile));
    }
    // Validation of configuration values
    this._envConfig = this._validateInput(config);
  }

  /**
   * Retrieves a configuration value from its key
   *
   * @param {string} key key of configuration value to retrieve
   * @returns {any} configuration value
   * @memberof ConfigService
   */
  public get(key: string): any {
    return this._envConfig[key];
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   *
   * @private
   * @param {EnvConfig} envConfig loaded configuration from .env file
   * @returns {EnvConfig} validated configuration
   * @throws {Error} Config validation error: message
   * @memberof ConfigService
   */
  private _validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = validate(envConfig, ENV_SCHEMA);
    if (error) throw new Error(`Config validation error: ${error.message}`);
    return validatedEnvConfig;
  }
}
