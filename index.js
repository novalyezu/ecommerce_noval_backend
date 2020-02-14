"use strict";

const server = require("./server/server")();
const config = require("./configs");

server.create(config);
server.start();
