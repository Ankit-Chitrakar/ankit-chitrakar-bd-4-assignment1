const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function connectDB() {
  return await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
}

module.exports = connectDB;
