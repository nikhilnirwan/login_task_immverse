// THIRD PARTY MODULES
require("dotenv").config("config.env");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const util = require("util");
// CORE MODULES
const express = require("express");

// SELF MODULES
const UserAuthRouter = require("./route/userAuthRoute");
const productRoute = require("./route/productRoute");

const requestBodyLogger = require("./helpers/winstonLogger");

const app = express();

app.options("*", cors());
app.use(cookieParser());
app.use(express.json());

app.use("*", (req, res, next) => {
  requestBodyLogger.info(
    `REQUEST BODY = ${util.inspect(req.body, { depth: null })}
     COOKIES = ${util.inspect(req.cookies, {
       depth: null,
     })}
     AUTHORIZATION HEADER = ${util.inspect(req.headers, {
       depth: null,
     })}
    `
  );
  next();
});
app.get("/", (req, res) => {
  const message = "Hello word";
  res.send({ message });
});

app.use("/auth", UserAuthRouter);
app.use("/product", productRoute);

module.exports = app;
