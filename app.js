const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDb = require("./init/mongodb");
const {authRoute,categoryRoute,fileRoute,postRoute} = require("./routes");
const {errorHandler} = require("./middleware");
const morgan = require("morgan");
const notFound = require("./controller/notFound");

//config dotenv to acess in virtual environment
dotenv.config()

const app = express();
connectDb();
app.use(express.json({limit : "500mb"}));
app.use(bodyParser.urlencoded({limit:"500mb",extended : true}));
//display the req in the console
app.use(morgan("dev"));
//route
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/file",fileRoute);
app.use("/api/v1/post",postRoute);
//notfound
app.use("*",notFound);

//error handling middleware
app.use(errorHandler);
module.exports = app
