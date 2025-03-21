const express = require("express");
const router = express.Router();
const {categoryController} = require("../controller");
const {addCategoryValidator,idValidator} = require("../validators/category");
const isAuth = require("../middleware/isAuth")
const validate = require("../validators/validator")
const isAdmin = require("../middleware/isAdmin")

router.post("/",isAuth,isAdmin,addCategoryValidator,validate,categoryController.addCategory);
router.put("/:id",isAuth, isAdmin,idValidator,validate,categoryController.updateCategory)
router.delete("/:id",isAuth, isAdmin, idValidator,validate,categoryController.deleteCategory);
router.get("/",isAuth,categoryController.getCategories);
router.get("/:id",isAuth, idValidator, validate,categoryController.getCategory)

module.exports = router;
