import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnv } from '../config/env.utils';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: getEnv(config, 'DB_HOST'),
    port: parseInt(getEnv(config, 'DB_PORT'), 10),
    username: getEnv(config, 'DB_USER'),
    password: getEnv(config, 'DB_PASSWORD'),
    database: getEnv(config, 'DB_NAME'),
    synchronize: true,
    autoLoadEntities: true,
  }),
};
