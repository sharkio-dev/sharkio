import { RequestMetadata } from "./lib/request-metadata/request-metadata";
import { NextFunction, Request, Response } from "express";
require("dotenv/config");
var proxy = require("express-http-proxy");
var app = require("express")();

const requestsMetadata = new RequestMetadata();

function snifferMiddleWare(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.path}`);
  requestsMetadata.extractMetadata(req);
  requestsMetadata.printStatistics();
  next();
}

function startProxy() {
  const { PROXY_HOSTNAME } = process.env;
  app.use(snifferMiddleWare);
  app.use("*", proxy(PROXY_HOSTNAME));
  app.listen(5012, () => {
    console.log("server started listening");
  });
  console.log(`start sniffing requests for ${PROXY_HOSTNAME}`);
}

startProxy();
