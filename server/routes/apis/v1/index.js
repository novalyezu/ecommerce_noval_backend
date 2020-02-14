"use strict";

// ADMIN
const express = require("express");
const authAdminController = require("../../../controllers/apis/authentication/auth-admin.controller");
const shippingServiceAdminController = require("../../../controllers/apis/shipping-service/shipping-service-admin.controller");
const paymentMethodAdminController = require("../../../controllers/apis/payment-method/payment-method-admin.controller");

// USER
const authController = require("../../../controllers/apis/authentication/auth.controller");
const merchantController = require("../../../controllers/apis/merchant/merchant.controller");

// INIT ROUTER
let router = express.Router();

// ADMIN
router.use("/admin/auth", authAdminController);
router.use("/admin/shipping_services", shippingServiceAdminController);
router.use("/admin/payment_methods", paymentMethodAdminController);

// USER
router.use("/auth", authController);
router.use("/merchants", merchantController);

module.exports = router;
