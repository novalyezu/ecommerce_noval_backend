"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");
const Merchant = require("./Merchant");

class Product extends Model {}
Product.init(
  {
    id_product: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: Sequelize.STRING
    },
    product_image: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    price: {
      type: Sequelize.INTEGER
    },
    stock: {
      type: Sequelize.INTEGER
    },
    is_active: {
      type: Sequelize.BOOLEAN
    },
    merchant_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    modelName: "product"
  }
);

Product.belongsTo(Merchant, { as: "merchant", foreignKey: "merchant_id" });

module.exports = Product;
