import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { decodeAuthToken, verifyToken } from '~/utils/jwt';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [name, token] = request.headers.authorization?.split(' ') || [];
    if (name !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    if (!(await verifyToken(token))) {
      throw new UnauthorizedException();
    }

    const data = decodeAuthToken(token);

    if (!data) {
      throw new UnauthorizedException();
    }

    request.user = data;

    return true;
  }
}
