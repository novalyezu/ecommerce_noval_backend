"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class ShippingService extends Model {}
ShippingService.init(
  {
    id_shipping_service: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    service_name: {
      type: Sequelize.STRING
    },
    service_logo: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.INTEGER
    },
    delivery_time: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize,
    modelName: "shipping_service"
  }
);

module.exports = ShippingService;
