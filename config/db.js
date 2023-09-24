const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });

const DB_URL = "mongodb://localhost:27017/product";
const dbConnect = () => {
  mongoose
    .connect(DB_URL)
    .then((data) => {
      console.log(`MongoDB connection succesfull :${DB_URL}`);
    })
    .catch((err) => {
      console.log(`error connecting to the database ${err}`);
    });
};

module.exports = dbConnect;
