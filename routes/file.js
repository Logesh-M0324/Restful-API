const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const {fileController} = require("../controller");
const upload = require("../middleware/upload");


router.post("/upload",isAuth,upload.single("image"),fileController.uploadFile);
router.get("/signed-url",isAuth,fileController.signedUrl)
router.delete("/delete-file",isAuth,fileController.deleteFile);

module.exports = router;
