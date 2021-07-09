const router = require("express").Router();
const uploadController = require("../../controllers/uploadController");
const categoryController = require("../../controllers/categoryController");

router.post("/upload", uploadController.createNewCategoryIfNeeded, uploadController.uploadFilesToDirectory,
    uploadController.resizeAndPostImagesInDb);

router.get("/categories", categoryController.searchCategories);
router.post("/categories", categoryController.createCategory)
router.delete("/categories", categoryController.deleteCategory);
router.patch("/categories/title", categoryController.patchCategoryTitle);

module.exports = router;
