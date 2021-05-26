const router = require("express").Router();
const adminController = require("../../controllers/adminController");
const uploadController = require("../../controllers/uploadController");

router.get("/categories", adminController.getIndexCategories);
router.get("/upload", uploadController.getIndex);

module.exports = router;