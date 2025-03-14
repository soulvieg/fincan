// config/db.js
const { Sequelize } = require("sequelize");

const dbName = process.env.DB_NAME || "DATABASE_NAME";
const dbUser = process.env.DB_USER || "USERNAME";
const dbPassword = process.env.DB_PASSWORD || "PASSWORD";
const dbHost = process.env.DB_HOST || "db";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
});

module.exports = sequelize;
