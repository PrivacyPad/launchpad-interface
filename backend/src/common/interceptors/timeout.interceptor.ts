import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';

const REQUEST_TIMEOUT = 60_000;

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const timeout = this.reflector.get<number>('timeout', context.getHandler()) || REQUEST_TIMEOUT;
    response.setTimeout(timeout);

    return next.handle();
  }
}
