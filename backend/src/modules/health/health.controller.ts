import { Controller, Get, Request } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  checkHealth(@Request() req: ExpressRequest) {
    return { status: 'ok', ip: req.ip };
  }
}
