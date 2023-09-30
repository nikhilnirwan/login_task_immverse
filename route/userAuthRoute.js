const express = require("express");

const userAuthController = require("../controller/userAuthController");
const router = express.Router();
router.post("/signup", userAuthController.signup);
router.post("/loginWithPassword", userAuthController.loginWithPassword);
router.get("/logout", userAuthController.logout);
router.patch("/resetPassword", userAuthController.resetPassword);
router.use(userAuthController.protect);
router.get("/getUserProfile", userAuthController.getUserProfile);
router.get("/getUsereRejex", userAuthController.getUserProfileRegex);
router.get("/getAllUser", userAuthController.getAllUser);
router.put("/update", userAuthController.updateUser);
router.delete("/delete", userAuthController.deleteUser);

module.exports = router;
