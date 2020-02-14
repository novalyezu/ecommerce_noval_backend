"use strict";

const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");

// FIREBASE
let config = require("../image-hosting-noval.json");

admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccount),
  storageBucket: config.storageBucket
});

module.exports = function() {
  let server = express();
  let create;
  let start;

  create = function(config) {
    let routes = require("./routes/router");

    // Server settings
    server.set("env", config.env);
    server.set("port", config.port);
    server.set("hostname", config.hostname);

    // Returns middleware that parses json
    server.use(morgan("dev"));
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(bodyParser.json({ type: "application/vnd.api+json" }));
    server.use(cors());
    server.use(compression());

    // Set up routes
    routes.init(server);
  };

  start = function() {
    let hostname = server.get("hostname");
    let port = server.get("port");

    server.listen(port, function() {
      console.log(
        "eCommerce server listening on - http://" + hostname + ":" + port
      );
    });
  };

  return {
    create: create,
    start: start
  };
};
