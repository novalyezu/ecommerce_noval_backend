"use strict";

// ADMIN
const express = require("express");
const authAdminController = require("../../../controllers/apis/authentication/auth-admin.controller");

// USER
const authController = require("../../../controllers/apis/authentication/auth.controller");
const merchantController = require("../../../controllers/apis/merchant/merchant.controller");

// INIT ROUTER
let router = express.Router();

// ADMIN
router.use("/admin/auth", authAdminController);

// USER
router.use("/auth", authController);
router.use("/merchants", merchantController);

module.exports = router;
