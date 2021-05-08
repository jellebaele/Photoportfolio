const router = require("express").Router();
const adminController = require("../../controllers/adminController");

router.get("/categories", adminController.getIndex);

module.exports = router;