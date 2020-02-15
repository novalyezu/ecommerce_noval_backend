"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class MerchantShippingService extends Model {}
MerchantShippingService.init(
  {
    id_merchant_shipping_service: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    merchant_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    shipping_service_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "merchant_shipping_service"
  }
);

module.exports = MerchantShippingService;
