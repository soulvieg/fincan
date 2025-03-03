// config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("DATABASE_NAME", "USERNAME", "PASSWORD", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
