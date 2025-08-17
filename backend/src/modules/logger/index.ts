import { Global, Module } from '@nestjs/common';
import { LoggerService } from './main.logger';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
export * from './main.logger';
