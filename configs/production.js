"use strict";

let prodConfig = {
  hostname: "https://novalcommerce.herokuapp.com/",
  port: process.env.PORT || 3000,
  env: "production",
  dbname: "9qippDy9aM",
  dbuser: "9qippDy9aM",
  dbpass: "bLtQAQ7nAO",
  dbhost: "remotemysql.com",
  dblogging: false,
  saltjwt: "ecommercetechnicaltestarkademy",
  refreshjwt: "ecommercetechnicaltestarkademyrefreshnya"
};

module.exports = prodConfig;
