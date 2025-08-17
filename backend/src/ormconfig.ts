import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { config } from '~/config';
import * as entities from '~/entities';

type CustomTypeOrmModuleOptions = TypeOrmModuleOptions & DataSourceOptions;

export const ormConfig: CustomTypeOrmModuleOptions = {
  type: 'postgres',
  name: config.DATABASE_NAME,
  host: config.DATABASE_HOST,
  port: Number(config.DATABASE_PORT),
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  autoLoadEntities: true,
  entities: Object.values(entities),
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  synchronize: false,
  connectTimeoutMS: 10000,
  extra: {
    max: 500,
  },
  logging: false,
  migrationsRun: false,
};

export const AppDataSource = new DataSource(ormConfig);
