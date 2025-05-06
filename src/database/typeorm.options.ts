import { config } from 'dotenv';
config();

import { DataSourceOptions } from 'typeorm';
import { User } from '../user/entities/user.entity';
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
export const typeOrmOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  logging: process.env.NODE_ENV === 'development',
};
