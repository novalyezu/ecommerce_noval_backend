"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class Merchant extends Model {}
Merchant.init(
  {
    id_merchant: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    merchant_name: {
      type: Sequelize.STRING
    },
    merchant_logo: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    address: {
      type: Sequelize.TEXT
    },
    open_date: {
      type: Sequelize.DATEONLY
    },
    user_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    modelName: "merchant"
  }
);

module.exports = Merchant;
