import { Injectable, LoggerService } from '@nestjs/common';
import * as pino from 'pino';

import { LOG_ENABLED, LOG_LEVEL } from '../../../../common/constants';
import { ConfigService } from '../../../../common/services';

/**
 * Service to log message
 *
 * @export
 * @class Logger
 * @implements {LoggerService}
 */
@Injectable()
export class Logger implements LoggerService {
  /**
   * Pino logger instance
   *
   * @private
   * @type {*}
   * @memberof Logger
   */
  private readonly _logger: pino.Logger;

  constructor(private _configService: ConfigService) {
    this._logger = pino({
      useLevelLabels: true,
      enabled: this._configService.get(LOG_ENABLED),
      level: this._configService.get(LOG_LEVEL),
    });
  }

  /**
   * Return pino logger instance
   *
   * @returns pino logger instance
   * @memberof Logger
   */
  public getLogger() {
    return this._logger;
  }

  /**
   * Log a message and data with 'trace' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public trace(message: any, data?: any) {
    this._doLog('trace', message, data);
  }

  /**
   * Log a message and data with 'debug' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public debug(message: any, data?: any) {
    this._doLog('debug', message, data);
  }

  /**
   * Log a message and data with 'info' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public info(message: any, data?: any) {
    this._doLog('info', message, data);
  }

  /**
   * Log a message and data with 'info' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public log(message: any, data?: any) {
    this._doLog('info', message, data);
  }

  /**
   * Log a message and data with 'warn' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public warn(message: any, data?: any) {
    this._doLog('warn', message, data);
  }

  /**
   * Log a message and data with 'error' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public error(message: any, data?: any) {
    this._doLog('error', message, data);
  }

  /**
   * Log a message and data with 'fatal' level
   *
   * @param {*} message message to log
   * @param {*} [data] additional data to log
   * @memberof Logger
   */
  public fatal(message: any, data?: any) {
    this._doLog('fatal', message, data);
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
  private _doLog(level: pino.Level, message: string, data?: any) {
    const child = this._logger.child({
      caller: this._getCaller(),
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
  private _getCaller(): string {
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
