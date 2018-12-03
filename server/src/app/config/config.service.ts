import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import * as path from 'path';

import { ENV_FOLDER } from '../common/constants';

import { ENV_SCHEMA } from './schemas/config.schema';

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
  private readonly envConfig: EnvConfig;

  constructor() {
    // Load of environment configuration
    const config = dotenv.parse(fs.readFileSync(path.join(ENV_FOLDER, `${process.env.NODE_ENV}.env`)));
    // Validation of configuration values
    this.envConfig = this.validateInput(config);
  }

  /**
   * Retrieves a configuration value from its key
   *
   * @param {string} key key of configuration value to retrieve
   * @returns {any} configuration value
   * @memberof ConfigService
   */
  public get(key: string): any {
    return this.envConfig[key];
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
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, ENV_SCHEMA);
    if (error) throw new Error(`Config validation error: ${error.message}`);
    return validatedEnvConfig;
  }
}
