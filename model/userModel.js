const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { myCustomLabels } = require("../helpers/common");
const Schema = mongoose.Schema;
mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const userModel = new Schema({
  fistName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  verificationToken: {
    Token: String,
    TokenExpiry: String,
  },
  password: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  userType: {
    type: String,
    enum: ["user", "admin"],
    required: false,
  },
  DOB: {
    type: String,
  },
});

userModel.plugin(mongoosePaginate);

const User = mongoose.model("User", userModel);
module.exports = User;
