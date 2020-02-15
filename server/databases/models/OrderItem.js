"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");
const Order = require("./Order");
const Product = require("./Product");

class OrderItem extends Model {}
OrderItem.init(
  {
    id_order_item: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    qty: {
      type: Sequelize.INTEGER
    },
    sub_total: {
      type: Sequelize.INTEGER
    },
    product_id: {
      type: Sequelize.INTEGER
    },
    order_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    modelName: "order_item"
  }
);

Order.hasMany(OrderItem, { as: "order_item", foreignKey: "order_id" });

OrderItem.belongsTo(Product, { as: "product", foreignKey: "product_id" });

module.exports = OrderItem;
