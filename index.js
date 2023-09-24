const path = require("path");
// CORE MODULES
require("dotenv").config({ path: path.join(__dirname, "config.env") });
const dbConnect = require("./config/db");
const app = require("./app");
dbConnect();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port number ${process.env.PORT}`);
});
server.setTimeout(29000);
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message} ${err}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message} ${err}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
