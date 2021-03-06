require('dotenv').config();

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
  // "ssl": true,
  ssl: { rejectUnauthorized: false },
  // "sslfactory" : org.postgresql.ssl.NonValidatingFactory,
  // "sslmode" : require
}