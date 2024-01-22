const pgp = require("pg-promise")();
const connectionString = "postgres://postgres:123456@localhost:5432/library_db";
const db = pgp(connectionString);

module.exports = db;
