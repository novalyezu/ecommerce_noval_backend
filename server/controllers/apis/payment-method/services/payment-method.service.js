"use strict";

const PaymentMethod = require("../../../../databases/models/PaymentMethod");

const getPaymentMethods = async () => {
  let paymentMethods = await PaymentMethod.findAll();

  return paymentMethods;
};

module.exports = {
  getPaymentMethods: getPaymentMethods
};
