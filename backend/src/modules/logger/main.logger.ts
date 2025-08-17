import { Injectable, Scope } from '@nestjs/common';
import pino from 'pino';
import moment from 'moment';
import _ from 'lodash';

import { config } from '~/config';

export class LoggerObject {
  method: string;
  className: string;
  request: string;
  agent: string;
  ip: string | undefined;
  bytes: number;
  statusCode: number;
  input: any;
  result: any;
  timeProcessing: number;
}

export class ExtraLoggerObject {
  id?: number = undefined;
  publicAddress?: string = '';
  height?: number = undefined;
  txHash?: string = undefined;
  tokenId?: number = undefined;
  event?: string = undefined;
  rawEvent?: string = undefined;
}

@Injectable({ scope: Scope.DEFAULT })
export class LoggerService {
  logger: pino.Logger;
  constructor() {
    this.logger = pino({
      level: config.LOG_LEVEL?.toLowerCase() || 'info',
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: () => `,"time":"${moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')}"`,
    });
  }

  log(type: 'fatal' | 'error' | 'warn' | 'info' | 'debug', logObject: LoggerObject, extra?: ExtraLoggerObject) {
    let reduced = new ExtraLoggerObject();
    _.assign(reduced, _.pick(extra, _.keys(reduced)));
    reduced = _.pickBy(reduced) as ExtraLoggerObject;

    const { method, className, request, agent, ip, bytes, statusCode, input, result, timeProcessing } = logObject;

    const mainLog = {
      context: `${request} - ${className}:${method}`,
      request,
      agent,
      ip,
      bytes,
      statusCode,
      input: input ? JSON.stringify(input) : null,
      result: result ? JSON.stringify(result) : null,
      timeProcessing,
      ...reduced,
    };

    this.logger[type](mainLog);
  }
}
