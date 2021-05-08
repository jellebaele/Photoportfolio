const router = require("express").Router();
const adminController = require("../../controllers/adminController");

router.get("/categories", adminController.getIndexCategories);

module.exports = router;