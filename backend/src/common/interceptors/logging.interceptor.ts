import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoggerService } from '~/modules/logger';
import { LogInfoOptionMetadata } from '../decorators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private loggerService: LoggerService,
    private reflector: Reflector,
  ) {}

  calculateTime(now: number): number {
    const spentTime = Date.now() - now;

    return spentTime;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logInfo = this.reflector.get<boolean>(LogInfoOptionMetadata, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();

    const methodKey = context.getHandler().name;
    const className = context.getClass().name;

    const now = Date.now();

    const input = {
      query: req?.query,
      params: req?.params,
      body: req?.body,
    };

    const main = {
      method: methodKey,
      className: className,
      request: req?.originalUrl,
      agent: req?.get('User-Agent') || '',
      ip: req?.ip,
      bytes: req?.socket?.bytesRead,
      input: input,
    };

    return next
      .handle()
      .pipe(
        tap({
          next: (val: unknown): void => {
            const spentTime = this.calculateTime(now);
            const res: Response = context.switchToHttp().getResponse<Response>();

            if (logInfo) {
              this.loggerService.log(
                'info',
                {
                  ...main,
                  statusCode: res?.statusCode,
                  result: val,
                  timeProcessing: spentTime,
                },
                req?.user,
              );
            }
          },
        }),
      )
      .pipe(
        catchError((err: Error) => {
          const spentTime = this.calculateTime(now);

          const errData =
            err instanceof HttpException
              ? typeof err?.getResponse() === 'object'
                ? {
                    ...(err?.getResponse() as object),
                    details: (err as any)?.options,
                  }
                : err?.getResponse()
              : err?.stack;

          this.loggerService.log(
            'error',
            {
              ...main,
              statusCode: err instanceof HttpException ? err.getStatus() : HttpStatus.FORBIDDEN,
              result: errData,
              timeProcessing: spentTime,
            },
            req?.user,
          );

          return throwError(() => err);
        }),
      );
  }
}
