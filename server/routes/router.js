"use strict";

const apiRoute = require("./apis");

function init(server) {
  server.get("*", function(req, res, next) {
    return next();
  });

  server.get("/", function(req, res) {
    return res.status(200).json({
      message: "App is working!"
    });
  });

  server.use("/api", apiRoute);

  server.use((req, res, next) => {
    const error = new Error("Not found!");
    error.status = 404;
    next(error);
  });

  server.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message
      }
    });
  });
}

module.exports = {
  init: init
};
