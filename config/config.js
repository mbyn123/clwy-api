const process = require('process');

module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "clwy1234",
    "database": process.env.DB_NAME || "clwy_api_dev",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00",
    "logQueryParameters": true
  },
  "test": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "clwy1234",
    "database": process.env.DB_NAME || "clwy_api_test",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  },
  "production": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "clwy1234",
    "database": process.env.DB_NAME || "clwy_api_prod",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  }
};
