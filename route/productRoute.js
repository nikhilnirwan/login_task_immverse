const express = require("express");
const userAuthController = require("../controller/userAuthController");
const addProductCon = require("../controller/addProduct");
const router = express.Router();

// router.use(userAuthController.protect);

router.post("/addProduct", addProductCon.addProduct);
router.get("/getProduct", addProductCon.getProduct);
router.get("/getProduct", addProductCon.getAllProduct);
router.put("/updateProduct", addProductCon.updateProduct);
router.delete("/deleteProduct", addProductCon.deleteProduct);

module.exports = router;
