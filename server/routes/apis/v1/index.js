"use strict";

// ADMIN
const express = require("express");
const authAdminController = require("../../../controllers/apis/authentication/auth-admin.controller");

// USER
const authController = require("../../../controllers/apis/authentication/auth.controller");

// INIT ROUTER
let router = express.Router();

// ADMIN
router.use("/admin/auth", authAdminController);

// USER
router.use("/auth", authController);

module.exports = router;
