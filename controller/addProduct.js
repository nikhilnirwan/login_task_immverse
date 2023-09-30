const catchAsync = require("../utils/catchAsync");
const Product = require("../model/productModel");

exports.addProduct = catchAsync(async (req, res, next) => {
  const { id, productName, productPrice, productImage } = req.body;

  await Product.create({
    productName: productName,
    productPrice: productPrice,
    productImage: productImage,
    userId: id,
  });
  res.status(200).json({
    status: "success",
    data: {
      message: "Product Create Successfully",
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const getProduct = await Product.findOne({ _id: id });
  res.status(200).json({
    status: "success",
    data: {
      message: "Product get Successfully",
      getProduct,
    },
  });
});

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const getProduct = await Product.paginate(req.body.query, req.body.options);
  res.status(200).json({
    status: "success",
    data: {
      message: "Product get Successfully.",
      getProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const getProduct = await Product.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  await getProduct.save();
  res.status(200).json({
    status: "success",
    data: {
      message: "Product Update Successfully.",
      getProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  await Product.remove({ _id: id });

  res.status(200).json({
    status: "success",
    data: {
      message: "Product delete successfully.",
    },
  });
});
