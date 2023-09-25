const express = require("express");
const router = express.Router();
const AuthController = require('../Controller/Auth.Controller');

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh-token", AuthController.refreshToken);

router.delete("/logout", AuthController.logout);

router.post("/forgotPassword", AuthController.forgotPassword);

router.patch("/resetPassword/:token", AuthController.resetPassword);

module.exports = router;
