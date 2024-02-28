require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    secret: process.env.JWT_PRIVATE_KEY,
    dialect: "sqlite",
    storage: 'fleet-manager.sqlite3'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    secret: process.env.JWT_PRIVATE_KEY,
    host: process.env.DB_HOST,
    dialect: "sqlite",
    storage: 'fleet-manager-test.sqlite3'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    secret: process.env.JWT_PRIVATE_KEY,
    host: process.env.DB_HOST,
    dialect: "sqlite"
  },
}
