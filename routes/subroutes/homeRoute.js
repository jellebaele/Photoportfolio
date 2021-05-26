const router = require("express").Router();
const overviewController = require('../../controllers/homeController')

router.get("/", overviewController.getIndex);
router.get("/")

module.exports = router;