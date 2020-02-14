"use strict";

const authAdminService = require("./services/auth-admin.service");
let router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../../../../configs/index");

router.post("/signup", async (req, res, next) => {
  let adminData = {
    name: req.body.name,
    phone_number: req.body.phone_number,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  };

  try {
    let user = await authAdminService.signUp(adminData);

    let token = jwt.sign(
      { username: user.username, role: user.role },
      config.saltjwt,
      { expiresIn: "30m" }
    );

    let refreshToken = jwt.sign(
      { username: user.username, role: user.role },
      config.refreshjwt,
      { expiresIn: "30 days" }
    );

    return res.status(201).json({
      status: "ok",
      message: "signup successfully!",
      data: user,
      token: token,
      refreshToken: refreshToken
    });
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  let adminData = {
    username: req.body.username,
    password: req.body.password
  };

  try {
    let user = await authAdminService.signIn(adminData);

    if (user.code === 200) {
      let token = jwt.sign(
        { username: user.data.username, role: user.data.role },
        config.saltjwt,
        { expiresIn: "30m" }
      );

      let refreshToken = jwt.sign(
        { username: user.data.username, role: user.data.role },
        config.refreshjwt,
        { expiresIn: "30 days" }
      );

      return res.status(user.code).json({
        status: user.status,
        message: user.message,
        data: user.data,
        token: token,
        refreshToken: refreshToken
      });
    } else {
      return res.status(user.code).json({
        status: user.status,
        message: user.message,
        data: user.data
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/refresh_token", async (req, res, next) => {
  let refresh_token = req.body.refresh_token;

  try {
    let decode = jwt.verify(refresh_token, config.refreshjwt);
    let token = jwt.sign(
      { username: decode.username, role: decode.role },
      config.saltjwt,
      { expiresIn: "30m" }
    );

    let refreshToken = jwt.sign(
      { username: decode.username, role: decode.role },
      config.refreshjwt,
      { expiresIn: "30 days" }
    );

    return res.status(200).json({
      status: "ok",
      message: "new token is ready to eat shit! DONT REQUEST ANYMORE!",
      token: token,
      refreshToken: refreshToken
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "refresh token expired, please re-login!",
        name: "TokenExpired"
      });
    } else {
      next(error);
    }
  }
});

module.exports = router;
