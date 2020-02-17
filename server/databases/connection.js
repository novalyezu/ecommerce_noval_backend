"use strict";

const Sequelize = require("sequelize");
const config = require("../../configs");

// STAGING atau DEV
let sequelize = new Sequelize(config.dbname, config.dbuser, config.dbpass, {
  host: config.dbhost,
  dialect: "mysql",
  define: {
    timestamps: false,
    freezeTableName: true
  },
  logging: config.dblogging
});

// PRODUCTION
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(config.dbname, config.dbuser, config.dbpass, {
    host: config.dbhost,
    dialect: "mysql",
    define: {
      timestamps: false,
      freezeTableName: true
    },
    logging: config.dblogging,
    dialectOptions: {
      socketPath: config.dbhost
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

module.exports = sequelize;
