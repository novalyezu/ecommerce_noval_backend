"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class Admin extends Model {}
Admin.init(
  {
    id_admin: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize,
    modelName: "admin"
  }
);

module.exports = Admin;
