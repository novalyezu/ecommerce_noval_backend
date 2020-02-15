"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");
const ShippingService = require("./ShippingService");

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

Merchant.belongsToMany(ShippingService, {
  as: "shipping_service",
  through: "merchant_shipping_service",
  foreignKey: "merchant_id",
  otherKey: "shipping_service_id"
});
ShippingService.belongsToMany(Merchant, {
  as: "shipping_service_merchants",
  through: "merchant_shipping_service",
  foreignKey: "shipping_service_id",
  otherKey: "merchant_id"
});

module.exports = Merchant;
