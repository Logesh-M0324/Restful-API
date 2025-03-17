const multer = require("multer");
const path = require("path");
const generate = require("../utils/generateCode")
const storage = multer.diskStorage({
    destination : (req, file ,callback)=>{
        callback(null, "./uploads");
    },
    filename :(req,file,callback)=>{
        //original_file_name_12digit_random_number.ext
        console.log(file); 
        const originalName = file.originalname;
        const extension = path.extname(originalName);
        const fileName = originalName.replace(extension,"");
        const compressedFilename = fileName.split(" ").join("_");
        // console.log(compressedFilename);
        const lowercaseFilename = compressedFilename.toLocaleLowerCase();
        const code = generate(12);
        const finalName = `${lowercaseFilename}_${code}${extension}`;
        callback(null, finalName);
    }
});

const upload =multer({
    storage,
    fileFilter :(req,file,callback)=>{
        const mimetype = file.mimetype;
        if(mimetype=="image/png"||mimetype=="image/jepg"||mimetype=="image/jpg"||mimetype == "application/pdf"){
            callback(null,true);
        }
        else{
            callback(new Error("only jpg,jepg,png,pdf format only allowed"));
        }
    }
});
 
module.exports = upload;