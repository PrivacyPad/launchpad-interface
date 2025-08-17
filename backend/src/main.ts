import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from './config';
import { LOG_LEVEL_MAPPING, LOG_LEVEL_NEST } from './constants';

async function bootstrap() {
  const logLevel = LOG_LEVEL_MAPPING[config.LOG_LEVEL || 'INFO'];
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: LOG_LEVEL_NEST.slice(logLevel) as LogLevel[],
  });

  app.enableCors({
    origin: config.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (config.SWAGGER_ENABLED) {
    const options = new DocumentBuilder()
      .setTitle('PrivacyPad API Documentation')
      .setVersion(config.SWAGGER_VERSION)
      .addBearerAuth()
      .addBasicAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(config.SWAGGER_PATH, app, document);
  }

  await app.listen(config.PORT);
}
bootstrap();
