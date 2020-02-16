"use strict";

const paymentMethodService = require("./services/payment-method.service");
const {
  checkToken,
  verifyToken
} = require("../../../middlewares/auth.middleware");
let router = require("express").Router();

router.get("/", checkToken, verifyToken, async (req, res, next) => {
  try {
    let paymentMethods = await paymentMethodService.getPaymentMethods();

    return res.status(200).json({ status: "ok", data: paymentMethods });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
