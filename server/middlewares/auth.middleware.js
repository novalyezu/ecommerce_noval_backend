"use strict";

const jwt = require("jsonwebtoken");
const config = require("../../configs/index");

const checkToken = (req, res, next) => {
  let bearerHeader = req.headers["authorization"];

  if (bearerHeader !== undefined) {
    let bearer = bearerHeader.split(" ");
    let bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(400).json({
      status: "fail",
      message: "token doesn't provide!",
      name: "NoToken"
    });
  }
};

const verifyToken = (req, res, next) => {
  let token = req.token;
  try {
    let decode = jwt.verify(token, config.saltjwt);
    req.decode = decode;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "token expired, please refresh token!",
        name: "TokenExpired"
      });
    } else {
      next(error);
    }
  }
};

const isAdminEcommerce = (req, res, next) => {
  let role = req.decode.role;

  if (role !== "superadmin") {
    return res.status(403).json({
      status: "fail",
      message: "Access denied!",
      name: "AccessDenied"
    });
  }
  next();
};

const isMerchant = (req, res, next) => {
  let role = req.decode.role;

  if (role !== "merchant") {
    return res.status(403).json({
      status: "fail",
      message: "Access denied!",
      name: "AccessDenied"
    });
  }
  next();
};

module.exports = {
  checkToken: checkToken,
  verifyToken: verifyToken,
  isAdminEcommerce: isAdminEcommerce,
  isMerchant: isMerchant
};
