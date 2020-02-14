"use strict";

const Admin = require("../../../../databases/models/Admin");

const _ = require("lodash");
const CryptoJS = require("crypto-js");

const signUp = async adminData => {
  let admin = await Admin.create({
    name: adminData.name,
    phone_number: adminData.phone_number,
    username: adminData.username,
    password: CryptoJS.AES.encrypt(
      adminData.password,
      "ECOMMERCE NOVAL"
    ).toString(),
    role: adminData.role
  });

  _.unset(admin, "dataValues.password");
  return admin;
};

const signIn = async adminData => {
  let admin = await Admin.findOne({
    where: { username: adminData.username }
  }).then(async data => {
    if (data !== null) {
      let real_password = CryptoJS.AES.decrypt(
        data.password,
        "ECOMMERCE NOVAL"
      ).toString(CryptoJS.enc.Utf8);

      if (real_password === adminData.password) {
        return {
          status: "ok",
          data,
          message: "login successfully!",
          code: 200
        };
      } else {
        return {
          status: "fail",
          data: [],
          message: "password is wrong!",
          code: 403
        };
      }
    }

    return {
      status: "fail",
      data: [],
      message: "username is not found!",
      code: 403
    };
  });

  _.unset(admin, "data.dataValues.password");
  return admin;
};

module.exports = {
  signUp: signUp,
  signIn: signIn
};
