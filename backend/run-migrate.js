require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

async function run() {
  const queryInterface = sequelize.getQueryInterface();

  const migrations = [
    './migrations/20240914-create-all-tables.js',
    './migrations/20240914-add-notified-fields.js'
  ];

  try {
    for (const file of migrations) {
      const migration = require(file);
      console.log(`Running ${file}...`);
      try {
        await migration.up(queryInterface, Sequelize);
        console.log(`OK: ${file}`);
      } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('duplicate column')) {
          console.log(`SKIP (already applied): ${file}`);
        } else {
          throw err;
        }
      }
    }
    console.log('\nAll migrations completed.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
