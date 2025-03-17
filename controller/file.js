const path = require("path");
const {validateExtension} = require("../validators/file");
const {uploadFileToS3,signedUrlToS3,deleteFileFromS3} = require("../utils/awsS3")
const File = require("../model/file");
const uploadFile = async(req,res,next)=>{
    try {
      const {file} = req;
      console.log(file.size);
      if(!file){
        res.code = 404;
        throw new Error("file is not selected");
      }
      const ext =  path.extname(file.originalname);
      const isValidExt = validateExtension(ext);
      if(!isValidExt){
        res.code = 400;
        throw new Error("only .jpg,.jpeg,.png format is allowed");
      }
      const files = await uploadFileToS3({file,ext});

      if(files){
        const newFile = await File({
          key :files,
          size: file.size,
          mimetype: file.mimetype,
          createdBy : req.user._id
        })
        await newFile.save();
      }


      res.status(201).json({code:201,status:true,message:"file uploaded successfully",data:{files}});  
    } catch (error) {
        next(error);
    }
}

const signedUrl = async(req,res,next)=>{
    try {
      const {key} = req.query;
      const url = await signedUrlToS3(key);
      console.log(url);
      res.status(200).json({code:200,status:true,message:"get signed url successfully",data:{url}})
    } catch (error) {
      next(error);
    }
}

const deleteFile = async(req,res,next)=>{
  try {
    const {key} = req.query;

    await deleteFileFromS3(key);
    await File.findOneAndDelete(key);

    res.status(200).json({code:200,status:true,message:"file deleted successfully"});
  } catch (error) {
    next(error);
  }
}

module.exports = {uploadFile,signedUrl,deleteFile};