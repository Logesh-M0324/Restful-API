const mongoose = require("mongoose");

const restSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true, trim:true},
    password:{type:String, require:true, minlength:6, trim:true},
    //for exmaple(role 1 ->super Admin  role 2 -> normal admin role 3 -> normal user)
    role:{type:Number, default:3},
    verificationCode:String,
    forgotpasswordCode:{type:String},
    isVerified:{type:Boolean,default:false},
    profilePic: {type:mongoose.Types.ObjectId, ref:"file"}
},{timestamps:true});

const user = mongoose.model("user",restSchema);

module.exports = user;
