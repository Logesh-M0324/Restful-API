const express = require("express");
const router = new express.Router();
const {authController} = require("../controller");
const {signupValidator,signinValidator,emailValidator,verifyuserValidator,recoverPasswordValidator,changePasswordValidator,updateProfileValidator} = require("../validators/auth");
const validate = require("../validators/validator");
const isAuth = require("../middleware/isAuth");

//route
router.post("/signup",signupValidator,validate,authController.signup);
router.post("/signin",signinValidator,validate,authController.signin);
router.post("/send-verificationCode",emailValidator,validate,authController.verifyCode);
router.post("/verify-user",verifyuserValidator,validate,authController.verifyUser);
router.post("/forget-password-code",emailValidator,validate,authController.forgotpasswordCode);
router.post("/recover-password",recoverPasswordValidator,validate,authController.recoverPassword);
router.put("/change-password",isAuth,changePasswordValidator,validate,authController.changePassword);
router.put("/update-profile",isAuth,updateProfileValidator,validate,authController.updateProfile)
router.get("/current-user",isAuth,authController.currentUser)


module.exports = router;