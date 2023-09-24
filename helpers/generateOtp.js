const path = require("path");
require("dotenv").config("config.env");
// const Email = require(path.join(__dirname, "..", "utils", "Email"));
const generateOtp = async function (mode, user, message, body) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const date = Date.now() + 10 * 60 * 1000;
  user[`verificationToken`][`${mode}Token`] = otp;
  user[`verificationToken`][`${mode}TokenExpiry`] = date;
  await user.save();
  // SENDING OTP TO USER PART
  if (mode === "email") {
    try {
      await new Email(user, otp).send(message, body);
    } catch (error) {
      console.log("EMAIL ERROR", error);
    }
  }
};

module.exports = generateOtp;
