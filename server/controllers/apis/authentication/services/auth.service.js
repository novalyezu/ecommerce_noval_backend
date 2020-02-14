"use strict";

const User = require("../../../../databases/models/User");

const _ = require("lodash");
const CryptoJS = require("crypto-js");

const signUp = async userData => {
  let user = await User.create({
    name: userData.name,
    phone_number: userData.phone_number,
    email: userData.email,
    password: CryptoJS.AES.encrypt(
      userData.password,
      "ECOMMERCE USER NOVAL"
    ).toString(),
    role: userData.role,
    address: userData.address
  });

  _.unset(user, "dataValues.password");
  return user;
};

const signIn = async userData => {
  let user = await User.findOne({
    where: { email: userData.email }
  }).then(async data => {
    if (data !== null) {
      let real_password = CryptoJS.AES.decrypt(
        data.password,
        "ECOMMERCE USER NOVAL"
      ).toString(CryptoJS.enc.Utf8);

      if (real_password === userData.password) {
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
      message: "email is not found!",
      code: 403
    };
  });

  _.unset(user, "data.dataValues.password");
  return user;
};

module.exports = {
  signUp: signUp,
  signIn: signIn
};
