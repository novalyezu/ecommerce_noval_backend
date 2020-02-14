"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class PaymentMethod extends Model {}
PaymentMethod.init(
  {
    id_payment_method: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    payment_method_name: {
      type: Sequelize.STRING
    },
    payment_method_logo: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize,
    modelName: "payment_method"
  }
);

module.exports = PaymentMethod;
