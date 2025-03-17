const { user, File } = require("../model")
const hashPassword = require("../utils/hashPassword")
const comparePassword = require("../utils/comparePassword")
const generateToken = require("../utils/generateToken")
const generateCode = require("../utils/generateCode")
const sendMail = require("../utils/sendEmail");

const signup = async(req,res,next)=>{
    try {
        const {name,email,password,role} = req.body;
        
        const hassedPassword = await hashPassword(password);

        const newUser = new user({name,password:hassedPassword,email,role}); 

        const isEmailExist = await user.findOne({email});
        if(isEmailExist){
            res.code = 400;
            throw new Error("Email already existed");
        }

        await newUser.save();

        res.status(201).json({code:201 ,status:true,message:"user registered Successful"});
    } catch (error) {
        next(error);
    }
}

const signin = async(req,res,next)=>{
    try {
        const {email,password}= req.body;
        const User = await user.findOne({email});
        if(!User){
            res.code = 401;
            throw new Error("Invalid Credentials");
        }

        const match = await comparePassword(password, User.password);
        if(!match){
            res.code = 401;
            throw new Error("Invalid Password");
        }
        const token = generateToken(User);
        res.status(200).json({code:200, status : true, message:"user signin successful", token:{token}});
        
    } catch (error) {
        next(error);
    }
}

const verifyCode = async(req,res,next)=>{
    try {
        const {email} = req.body;

        const users = await user.findOne({email});
        if(!users){
            res.code = 404;
            throw new Error("user not found");
        }
        if(users.isVerified){
            res.code = 400;
            throw new Error("user is Already Verified");
        }
        const code = generateCode(6);
        console.log(code);
        users.verificationCode = code;
        await users.save();

        await sendMail({
            emailTo: users.email,
            subject: "verification code for login",
            code,
            content: "verfiy your account"
        });
        res.status(200).json({code:200, status: true, message:"user verfication code sent successfully"});
    } catch (error) {
        next(error);
    }
}

const verifyUser = async(req,res,next)=>{
    try {
        const{email,code} = req.body;
        const users = await user.findOne({email});
        if(!users){
            res.code = 404;
            throw new Error("user not found");
        }
        if(users.verificationCode!= code){
            res.code = 400;
            throw new Error("Invalid code");
        }
        users.isVerified = true;
        users.verificationCode = null;
        await users.save();
        res.status(200).json({code:200,status:true,message:"user verified successfully"});
    } catch (error) {
        next(error);
    }
}

const forgotpasswordCode = async(req,res,next)=>{
    try {
        const {email} = req.body;
        const users = await user.findOne({email});
        if(!users){
            res.code = 404;
            throw new Error("user not found");
        }

        const code = generateCode(6);
        users.forgotpasswordCode = code;
        await users.save();

        await sendMail({
            emailTo:users.email,
            subject:"forget password code",
            code,
            content: "change your pass"
        });
        res.status(200).json({code:200,status:true,message:"forgetpassword sent successfully"});
    } catch (error) {
        next(error);
    }
}

const recoverPassword = async(req,res,next)=>{
    try {
        const {email,code,password} = req.body;
        const users = await user.findOne({email});
        if(!users){
            res.code = 404;
            throw new Error("user not found");
        }
        if(users.forgotpasswordCode != code){
            res.code = 400;
            throw new Error("Invalid code");
        }

        const hashedPassword = await hashPassword(password);
        users.password = hashedPassword;
        users.forgotpasswordCode = null;
        await users.save();
        res.status(200).json({code:200,status:true,Message:"password recovered successfully"});
        
    } catch (error) {
        next(error);
    }
}

const changePassword = async(req,res,next)=>{
    try {
        const {oldPassword,newPassword} = req.body;
        const {_id} = req.user;
        const users = await user.findById({_id});
        if(!users){
            res.code = 404;
            throw new Error("user not found");
        }
        const match = await comparePassword(oldPassword,users.password);
        if(!match){
            res.code = 400;
            throw new Error("oldPassword is not matched");
        }
        if(oldPassword == newPassword){
            res.code = 400;
            throw new Error("you are providing old password");
        }
        const hashedPassword = await hashPassword(newPassword);
        users.password = hashedPassword;
        await users.save();
        res.status(200).json({code:200,status:true,message:"password changed successfully"});
    } catch (error) {
        next(error);
    }
}

const updateProfile = async(req,res,next)=>{
    try {
        const {_id} = req.user;
        const{email,name,profilePic} = req.body;

        const users = await user.findById({_id}).select("-password -isVerified");
        if(!users){
            res.code = 404;
            throw new Error("user not found");
        }
        if(email){
            users.isVerified = false;
        }
        if(profilePic){
            const file = await File.findById(profilePic);
            if(!file){
                res.code = 404;
                throw new Error("file not found");
            }
        }

        users.name = name ? name : users.name;
        users.email = email ? email : users.email;
        users.profilePic = profilePic;
        await users.save();
        res.status(200).json({code:200,status:true,message:"user profile updated sucessfully", data:{users}});
    } catch (error) {
        next(error);
    }
}

const currentUser = async (req, res, next) => {
    try {
        const {_id} = req.user;
        const users = await user.findById(_id).select("-password -verificationCode -forgotPasswordCode").populate("profilePic");

        if (!users) {
            res.code = 404;
            throw new Error("not found");
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Get current user successfully",
            data: { user: users },
        });
    } catch (error) {
        // Pass error to the next middleware
        next(error);
    }
};


module.exports = {signup,signin,verifyCode,verifyUser,forgotpasswordCode,recoverPassword,changePassword,updateProfile,currentUser};