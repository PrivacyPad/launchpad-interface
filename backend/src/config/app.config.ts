/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import z from 'zod';
import { parseEnv } from 'znv';

const envSchema = z.object({
  ENV_PROJECT: z.enum(['local', 'development', 'staging', 'production']),
  LOG_LEVEL: z.enum(['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'SILENT']).default('INFO'),
  PORT: z.number(),
  PROJECT_PREFIX: z.string().default(''),
  SWAGGER_ENABLED: z.boolean().default(true),
  SWAGGER_PATH: z.string().default('docs'),
  SWAGGER_VERSION: z.string().default('1.0.0'),

  CORS_ALLOWED_ORIGINS: z.string(),

  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  BASIC_AUTH_USERNAME: z.string(),
  BASIC_AUTH_PASSWORD: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.number(),
  REDIS_PASSWORD: z.string(),
  REDIS_TLS: z.boolean(),

  JWT_SECRET: z.string(),
  JWT_EXPIRE_TIME: z.string(),
});

export type Config = z.infer<typeof envSchema>;

const config = parseEnv(process.env, envSchema.shape);

export { config };
