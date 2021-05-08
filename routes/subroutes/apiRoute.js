const router = require("express").Router();
const uploadController = require("../../controllers/uploadController");
const categoryController = require("../../controllers/categoryController");

router.get("/upload", uploadController.getIndex);
router.post("/upload", uploadController.uploadFiles, uploadController.postImages);

router.get("/categories", categoryController.searchCategories);
router.delete("/categories", categoryController.deleteCategory);

module.exports = router;
