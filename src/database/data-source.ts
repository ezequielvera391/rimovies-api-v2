import { config } from 'dotenv';
config();
import { DataSource } from 'typeorm';
import { typeOrmOptions } from './typeorm.options';

export default new DataSource({
  ...typeOrmOptions,
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: false,
});
