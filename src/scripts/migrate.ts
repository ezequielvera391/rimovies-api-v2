import dataSource from '../database/data-source';

async function run() {
  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
  console.log('Migrations ran successfully.');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
