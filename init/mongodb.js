const mongoose = require("mongoose");
const {connection_url} = require("../config/keys");
const connectDb = async()=>{
    try {
        await mongoose.connect(connection_url);
        console.log("database connected successfully");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDb;