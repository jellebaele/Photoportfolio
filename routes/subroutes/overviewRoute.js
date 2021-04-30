const router = require("express").Router();
const overviewController = require('../../controllers/overviewController')

router.get("/", overviewController.getIndex)

module.exports = router;