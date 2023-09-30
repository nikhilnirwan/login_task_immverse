const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });

const { promisify } = require("util");
const generateOtp = require("../helpers/generateOtp");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/AppErr");
const encryptPassword = require("../helpers/encryptPassword");
const User = require("../model/userModel");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const payload = `${user}--${user.id}`;

  const token = signToken(payload);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined; // hide password field from the response of document
  res.status(statusCode).json({
    status: "success",
    token: token,
    user: user,
  });
};

//
// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const { fistName, lastName, DOB, email, password, country, userType } = req.body;

  const hashedPassword = await encryptPassword.hashPassword(password);
  const doc = await User.create({
    fistName: fistName,
    lastName: lastName,
    DOB: DOB,
    password: hashedPassword,
    email: email,
    country: country,
    userType: userType,
  });

  // await generateOtp("email", doc, "Otp send successfully");
  doc.password = undefined;
  res.status(200).json({
    status: "success",
    user: doc,
  });
});

// LOGIN with id and password
exports.loginWithPassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let doc = await User.findOne({ email: email }).select("+password");
  if (!doc) return next(new AppErr("Mobile is Incorrect", 400));
  if (!(await encryptPassword.unHashPassword(password, doc.password))) {
    return next(new AppErr("Password is Incorrect", 400));
  }
  createSendToken(doc, 200, res);
});

//PROTECT route to chake user is login or not
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization && req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization?.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req?.cookies?.jwt;
    const cookieToken = req?.cookies?.jwt;
  }
  if (!token) {
    return next(new AppErr("You are not logged  in!!! Please log in to get access.", 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const id = decoded?.id?.split("--")[1];
  if (!id) return next(new AppErr("JWT Malformed"), 401);
  const currentUser = await User.findById(id);

  if (!currentUser) {
    return next(new AppErr(" The user belonging to this token no longer exists", 401));
  }

  req.user = currentUser;
  req.identity = id;
  next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  const hashedPassword = await encryptPassword.hashPassword(password);
  user.password = hashedPassword;
  user.passwordChangedAt = Date.now() - 1 * 60 * 100;
  await user.save();
  createSendToken(user, 200, res);
});

// logout
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      message: "User successfully logged out",
    },
  });
});

// get user using regex
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  const data = await User.findOne({ _id: user._id });
  res.status(200).json({
    status: "success",
    data,
  });
});

// get user using regex search query
exports.getUserProfileRegex = catchAsync(async (req, res, next) => {
  const search = req.body.search;
  const data = await User.find(search);
  res.status(200).json({
    status: "success",
    data,
  });
});

// get all user
exports.getAllUser = catchAsync(async (req, res, next) => {
  const data = await User.paginate(req.body.query, req.body.options);
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (req.body?.password) {
    req.body.password = await encryptPassword.hashPassword(req.body.password);
  }
  const updateDetail = await User.findByIdAndUpdate(
    { _id: user._id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  await updateDetail.save();
  res.status(200).json({
    status: "success",
    data: {
      message: "User details update Successfully.",
      updateDetail,
    },
  });
});
