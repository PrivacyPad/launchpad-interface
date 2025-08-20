import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { config } from '~/config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authenticationArray = request?.headers?.authorization?.split?.(' ');

    const token = authenticationArray?.[1];

    if (!token?.length) {
      throw new UnauthorizedException();
    }

    const tokenDecoded = Buffer.from(token, 'base64').toString();

    const tokenArr = tokenDecoded.split(':');
    const username = tokenArr[0];
    const password = tokenArr[1];

    if (username === config.BASIC_AUTH_USERNAME && password === config.BASIC_AUTH_PASSWORD) return true;
    else throw new UnauthorizedException();
  }
}
