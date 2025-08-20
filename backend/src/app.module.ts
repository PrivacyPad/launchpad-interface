import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { RateLimitGuard } from './common/guards';
import { LoggingInterceptor, TimeoutInterceptor } from './common/interceptors';
import { AuthModule } from './modules/auth';
import { HealthModule } from './modules/health';
import { LoggerModule } from './modules/logger';
import { UserModule } from './modules/user';
import { ormConfig } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      bigNumberStrings: false,
      ...ormConfig,
    } as Partial<TypeOrmModuleOptions>),

    ThrottlerModule.forRoot([
      {
        ttl: 60000, // ms
        limit: 60,
      },
    ]),

    LoggerModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
