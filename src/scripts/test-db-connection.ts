import { DataSource } from 'typeorm';
import { typeOrmOptions } from '../database/typeorm.options';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

async function testConnection() {
  console.log('Testing database connection...');
  const options = typeOrmOptions as PostgresConnectionOptions;

  console.log('Connection options:', {
    host: options.host,
    port: options.port,
    username: options.username,
    database: options.database,
  });

  const dataSource = new DataSource(options);

  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful!');

    // Test query
    const result = await dataSource.query('SELECT NOW()');
    console.log('Current database time:', result[0].now);

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

void testConnection();
