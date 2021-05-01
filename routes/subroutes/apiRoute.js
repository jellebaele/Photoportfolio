const router = require("express").Router();
const uploadController = require("../../controllers/uploadController");
const categoryController = require("../../controllers/categoryController");

router.get("/upload", uploadController.getIndex);
router.post("/upload", uploadController.uploadFiles, uploadController.postImages);

// router.get("/category", categoryController.getCategories);
router.get("/category-search", categoryController.searchCategories);

module.exports = router;
