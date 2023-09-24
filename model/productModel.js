const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { myCustomLabels } = require("../helpers/common");
const Schema = mongoose.Schema;

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};
const productModel = new Schema({
  productName: {
    type: String,
    required: false,
  },
  productPrice: {
    type: String,
    required: false,
  },
  productImage: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

productModel.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productModel);
module.exports = Product;
