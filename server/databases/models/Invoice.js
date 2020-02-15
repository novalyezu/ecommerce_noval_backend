"use strict";

const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class Invoice extends Model {}
Invoice.init(
  {
    id_invoice: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: Sequelize.STRING
    },
    bill_total: {
      type: Sequelize.INTEGER
    },
    payment_date: {
      type: Sequelize.DATEONLY
    },
    payment_method_id: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    modelName: "invoice"
  }
);

module.exports = Invoice;
