const {PutObjectCommand,S3Client,GetObjectCommand,DeleteObjectCommand} = require("@aws-sdk/client-s3");
const {awsRegion,awsAccessKey,awsSecretAccessKey, awsBucketName} = require("../config/keys");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const generateCode = require("./generateCode");
const client = new S3Client({
    region : awsRegion,
    credentials : {
        accessKeyId :awsAccessKey,
        secretAccessKey : awsSecretAccessKey
    }
})


const uploadFileToS3 = async({file,ext})=>{
    //some_random_number_some_random_number.ext
    const Key = `${generateCode(12)}_${Date.now()}${ext}`;

    const params = {
        Bucket: awsBucketName,
        Body: file.buffer,
        Key,
        ContentType: file.mimeType
    }

    const command = new PutObjectCommand(params);

    try {
        await client.send(command);
        return Key;
    } catch (error) {
        console.log(error);
    }

};

const signedUrlToS3 = async(Key)=>{
    const params = {
        Bucket: awsBucketName,
        Key,
    } 
    const command = new GetObjectCommand(params);
    try{
        const url = await getSignedUrl(client, command, {expiresIn: 60*60});
        return url;
    }catch (error) {
      console.log(error);
    }
}

const deleteFileFromS3 = async(Key)=>{
    const params = {
        Bucket :awsBucketName,
        Key
    }
    const command = new DeleteObjectCommand(params);
    try {
        await client.send(command);
        return;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {uploadFileToS3,signedUrlToS3,deleteFileFromS3};