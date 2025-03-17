const {check} = require("express-validator");
const validateEmail = require("./validateEmail");
const mongoose = require("mongoose");
const signupValidator = [
    check("name").notEmpty().withMessage("name is required"),
    check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("email is required"),
    check("password").isLength({min:6}).withMessage("password should be 6 char long").notEmpty().withMessage("password is required"),
];

const signinValidator = [
    check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("email is required"),
    check("password").notEmpty().withMessage("password is required")
];

const emailValidator = [
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("email is required")
]

const verifyuserValidator = [
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("email is required"),
    check("code").notEmpty().withMessage("code is required")
]

const recoverPasswordValidator = [
    check("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("email is required"),
    check("code").notEmpty().withMessage("code is required"),
    check("password").isLength({min:6}).withMessage("password should be 6 char long").notEmpty().withMessage("password is required")
]

const changePasswordValidator = [
    check("oldPassword").notEmpty().withMessage("old password is required"),
    check("newPassword").notEmpty().withMessage("new password is required")
]

const updateProfileValidator = [
    check("email").custom(async(email)=>{
        if(email){
            const isvalidEmail = validateEmail(email);
            if(!isvalidEmail){
                throw "Invalid Email";
            }
        }
    }),
    check("profilePic").custom(async(profilePic)=>{
        if(profilePic && !mongoose.Types.ObjectId.isValid(profilePic)){
            throw "Invalid profile picture";
        }
    })
]

module.exports = {signupValidator,signinValidator,emailValidator,verifyuserValidator,recoverPasswordValidator,changePasswordValidator,updateProfileValidator};