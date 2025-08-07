import { config } from 'dotenv';
config();
import { DataSourceOptions } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { AccessToken } from '../auth/entities/access-token.entity';

console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
});

export const typeOrmOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5434', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, RefreshToken, AccessToken],
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: true,
  logging: true,
  uuidExtension: 'uuid-ossp',
  extra: {
    useUTC: true,
    uuidExtension: 'uuid-ossp',
  },
  connectTimeoutMS: 10000,
};
