import { LoggerService } from '@nestjs/common';
import * as pino from 'pino';

import { ConfigService } from '../config/config.service';

/**
 * Service to log message
 *
 * @export
 * @class Logger
 * @implements {LoggerService}
 */
export class Logger implements LoggerService {
  /**
   * Pino logger instance
   *
   * @private
   * @type {*}
   * @memberof Logger
   */
  private readonly logger: pino.Logger;

  constructor(private configService: ConfigService) {
    this.logger = pino({
      useLevelLabels: true,
      enabled: this.configService.get('LOG_ENABLED'),
      level: this.configService.get('LOG_LEVEL'),
    });
  }

  /**
   * Return pino logger instance
   *
   * @returns pino logger instance
   * @memberof Logger
   */
  public getLogger() {
    return this.logger;
  }

  /**
   * Log a message and data with 'trace' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public trace(message: any, data?: any) {
    this.doLog('trace', message, data);
  }

  /**
   * Log a message and data with 'debug' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public debug(message: any, data?: any) {
    this.doLog('debug', message, data);
  }

  /**
   * Log a message and data with 'info' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public info(message: any, data?: any) {
    this.doLog('info', message, data);
  }

  /**
   * Log a message and data with 'info' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public log(message: any, data?: any) {
    this.doLog('info', message, data);
  }

  /**
   * Log a message and data with 'warn' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public warn(message: any, data?: any) {
    this.doLog('warn', message, data);
  }

  /**
   * Log a message and data with 'error' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public error(message: any, data?: any) {
    this.doLog('error', message, data);
  }

  /**
   * Log a message and data with 'fatal' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public fatal(message: any, data?: any) {
    this.doLog('fatal', message, data);
  }

  /**
   * Logs message
   *
   * @private
   * @param {pino.Level} level log message level
   * @param {string} message message to log
   * @param {*} [data] optional data to add to log line
   * @memberof Logger
   */
  private doLog(level: pino.Level, message: string, data?: any) {
    const child = this.logger.child({
      caller: this.getCaller(),
      data: data ? (data instanceof Error ? data.stack : data) : undefined,
    });
    child[level](message);
  }

  /**
   * Get logger caller file, line and column
   *
   * @private
   * @returns {string} file:line:column
   * @memberof Logger
   */
  private getCaller(): string {
    // If possible, extracts infos from stack
    let caller = '';
    const e = new Error();
    if (e.stack) {
      const call = /at (.*) \(.*\)/.exec(e.stack.split('\n')[5]);
      if (call) {
        // Extraction of file:line:column
        const line = /.* \(.*\\(.*)\)/.exec(call[0]);
        // Creation of log header
        if (line && line.length >= 1) caller = line[1];
      }
    }
    return caller;
  }
}
