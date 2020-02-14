"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class User extends Model {}
User.init(
  {
    id_user: {
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
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.TEXT
    }
  },
  {
    sequelize,
    modelName: "user"
  }
);

module.exports = User;
