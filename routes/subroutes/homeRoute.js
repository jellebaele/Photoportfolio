const router = require("express").Router();
const overviewController = require('../../controllers/homeController')

router.get("/", overviewController.getIndex);

module.exports = router;