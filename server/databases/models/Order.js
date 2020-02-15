"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");
const Merchant = require("./Merchant");

class Order extends Model {}
Order.init(
  {
    id_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    total_item: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.STRING
    },
    merchant_id: {
      type: Sequelize.INTEGER
    },
    shipping_service_id: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    invoice_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    modelName: "order"
  }
);

Order.belongsTo(Merchant, { as: "merchant", foreignKey: "merchant_id" });

module.exports = Order;
